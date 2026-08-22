const filterHistoryByWeek = (history, week) => (
  week === 'all' ? history : history.filter((pairing) => pairing.week === week)
);

const shouldShowNewPairingBanner = (pairing, currentWeek, dismissed) => (
  Boolean(pairing && pairing.week === currentWeek && !dismissed)
);

const getCurrentPairingMessage = (pairing, published) => {
  if (pairing) return 'Your learning partner for this week.';
  if (!published) return "Your Technical Mentor has not published this week's pairings yet. Check back soon.";
  return 'No pairing is available for this week.';
};

export { filterHistoryByWeek, getCurrentPairingMessage, shouldShowNewPairingBanner };
