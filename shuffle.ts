export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Keeps items marked `featured` pinned at the top, in a stable order (so
// they never move around), while everything else is shuffled below them
// on every request — so featured profiles/businesses stay put and the
// rest keep rotating.
export function shuffleWithFeatured<T extends { featured?: boolean | null }>(
  arr: T[]
): T[] {
  const featured = arr.filter((item) => !!item.featured);
  const rest = arr.filter((item) => !item.featured);
  return [...featured, ...shuffle(rest)];
}
