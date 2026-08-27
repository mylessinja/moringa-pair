import {
  filterHistoryByWeek,
  getCurrentPairingMessage,
  shouldShowNewPairingBanner,
} from './pairingUtils';

describe('pairing utilities', () => {
  const history = [
    { week: '2026-08-17', partner: 'Sarah Kim' },
    { week: '2026-08-10', partner: 'David Turner' },
  ];

  test('filters history by the selected week', () => {
    expect(filterHistoryByWeek(history, '2026-08-10')).toEqual([history[1]]);
    expect(filterHistoryByWeek(history, 'all')).toEqual(history);
  });

  test('returns the unpublished empty state message', () => {
    expect(getCurrentPairingMessage(null, false)).toMatch(/has not published/);
    expect(getCurrentPairingMessage(history[0], true)).toMatch(/learning partner/);
  });

  test('shows the new pairing banner only for an active, undismissed week', () => {
    expect(shouldShowNewPairingBanner(history[0], '2026-08-17', false)).toBe(true);
    expect(shouldShowNewPairingBanner(history[0], '2026-08-10', false)).toBe(false);
    expect(shouldShowNewPairingBanner(history[0], '2026-08-17', true)).toBe(false);
  });
});
