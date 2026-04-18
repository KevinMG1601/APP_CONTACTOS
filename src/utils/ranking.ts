import type { RankingRow } from '../types';

const SEED = [
  { name: 'Alex R.', score: 95 },
  { name: 'Maria G.', score: 72 },
  { name: 'Diego P.', score: 55 },
  { name: 'Lucia F.', score: 38 },
];

export function buildTopRanking(displayName: string, userPoints: number): RankingRow[] {
  const rows = [
    ...SEED.map((s) => ({ name: s.name, score: s.score, isCurrentUser: false })),
    { name: displayName || 'Tu usuario', score: userPoints, isCurrentUser: true },
  ];
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, 5).map((r, i) => ({
    position: i + 1,
    name: r.name,
    score: r.score,
    isCurrentUser: r.isCurrentUser,
  }));
}
