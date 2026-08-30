from models import db, AuditLog


def log_action(user, action, detail=None):
    """
    Records an audit log entry. Does not commit — caller should already
    be inside a db.session that gets committed as part of the same
    request (so the log entry and the action it describes succeed or
    fail together).
    """
    entry = AuditLog(
        actor_id=user.id if user else None,
        actor_name=f"{user.name} ({user.role.capitalize()})" if user else "System",
        action=action,
        detail=detail,
    )
    db.session.add(entry)
