// Randomly shuffles a roster into pairs. If the roster has an odd
// number of people, the last person joins the final pair as a trio
// instead of being left unpaired.
export function generatePairings(roster) {
  const shuffled = [...roster];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const pairs = [];
  let id = 1;
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      pairs.push({ id: id++, members: [shuffled[i], shuffled[i + 1]] });
    } else if (pairs.length > 0) {
      pairs[pairs.length - 1].members.push(shuffled[i]);
    } else {
      pairs.push({ id: id++, members: [shuffled[i]] });
    }
  }
  return pairs;
}
