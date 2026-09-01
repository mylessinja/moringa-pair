"""
Optional AI refinement for pairings via xAI (Grok) OpenAI-compatible API.
Falls back to balanced algorithm if disabled or on any failure.
"""
import json
import re
import urllib.error
import urllib.request

from flask import current_app

from services.pairing_service import (
    PairingError,
    preview_pairings,
    _student_ids,
    _mastery_map,
    _name_map,
    _recent_partner_map,
    DEFAULT_LOOKBACK_WEEKS,
)


def _chat_completion(messages):
    api_key = current_app.config.get("XAI_API_KEY") or ""
    base = current_app.config.get("PAIRING_AI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
    model = current_app.config.get("PAIRING_AI_MODEL", "grok-2-latest")

    if not api_key:
        raise PairingError("XAI_API_KEY is not configured")

    body = json.dumps(
        {
            "model": model,
            "messages": messages,
            "temperature": 0.3,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        f"{base}/chat/completions",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def _extract_json(text):
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


def preview_pairings_ai(cohort_id, week_start, focus=None, lookback_weeks=DEFAULT_LOOKBACK_WEEKS):
    """
    Use AI to propose pairs; validate strictly. On failure → balanced preview.
    """
    enabled = current_app.config.get("PAIRING_AI_ENABLED", False)
    if not enabled:
        preview = preview_pairings(
            cohort_id, week_start, focus=focus, lookback_weeks=lookback_weeks, mode="balanced"
        )
        preview["mode"] = "balanced_fallback"
        preview["ai_note"] = "AI disabled; used balanced algorithm"
        return preview

    student_ids = _student_ids(cohort_id)
    if len(student_ids) < 2:
        raise PairingError("Cohort needs at least 2 students to generate pairings.")

    mastery = _mastery_map(cohort_id)
    names = _name_map(student_ids)
    recent = _recent_partner_map(cohort_id, week_start, lookback_weeks)

    forbidden = []
    for sid, partners in recent.items():
        for pid in partners:
            if sid < pid:
                forbidden.append([sid, pid])

    roster = [
        {"id": sid, "name": names.get(sid, str(sid)), "mastery": mastery.get(sid, 50)}
        for sid in student_ids
    ]

    system = (
        "You are a teaching assistant that assigns weekly pair-programming partners. "
        "Return ONLY valid JSON with this shape: "
        '{"pairs":[{"student_a_id":int,"student_b_id":int,"rationale":string,"score":float}]}. '
        "Rules: use each student id at most once; prefer complementary mastery; "
        "avoid forbidden pairs when possible; score is 0-1 confidence."
    )
    user_msg = json.dumps(
        {
            "students": roster,
            "forbidden_pairs": forbidden,
            "focus": focus,
            "week_start": week_start.isoformat(),
        }
    )

    try:
        raw = _chat_completion(
            [
                {"role": "system", "content": system},
                {"role": "user", "content": user_msg},
            ]
        )
        parsed = _extract_json(raw)
        ai_pairs = parsed.get("pairs") or []
    except Exception as exc:
        preview = preview_pairings(
            cohort_id, week_start, focus=focus, lookback_weeks=lookback_weeks, mode="balanced"
        )
        preview["mode"] = "balanced_fallback"
        preview["ai_note"] = f"AI failed ({exc}); used balanced algorithm"
        return preview

    member_set = set(student_ids)
    seen = set()
    valid = []
    for item in ai_pairs:
        try:
            a = int(item["student_a_id"])
            b = int(item["student_b_id"])
        except (KeyError, TypeError, ValueError):
            continue
        if a not in member_set or b not in member_set or a == b:
            continue
        if a in seen or b in seen:
            continue
        seen.add(a)
        seen.add(b)
        is_rep = b in recent.get(a, set())
        valid.append(
            {
                "student_a_id": a,
                "student_b_id": b,
                "student_a": names.get(a),
                "student_b": names.get(b),
                "is_repeat": is_rep,
                "rationale": item.get("rationale"),
                "score": item.get("score"),
            }
        )

    leftover_ids = [i for i in student_ids if i not in seen]
    # If AI left too many unpaired, fall back
    if len(valid) < len(student_ids) // 2:
        preview = preview_pairings(
            cohort_id, week_start, focus=focus, lookback_weeks=lookback_weeks, mode="balanced"
        )
        preview["mode"] = "balanced_fallback"
        preview["ai_note"] = "AI returned incomplete pairs; used balanced algorithm"
        return preview

    unpaired = leftover_ids[0] if leftover_ids else None
    return {
        "cohort_id": cohort_id,
        "week_start": week_start.isoformat(),
        "mode": "ai",
        "focus": focus,
        "pairs": valid,
        "repeat_count": sum(1 for p in valid if p["is_repeat"]),
        "repeats": [
            {"student_a_id": p["student_a_id"], "student_b_id": p["student_b_id"]}
            for p in valid
            if p["is_repeat"]
        ],
        "unpaired_student_id": unpaired,
        "unpaired_student": names.get(unpaired) if unpaired else None,
    }
