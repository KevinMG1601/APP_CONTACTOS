export type MissionId = 1 | 2 | 3;

export interface MissionProgress {
  id: MissionId;
  completed: boolean;
}

export interface UserProgress {
  points: number;
  missions: MissionProgress[];
}

export type MissionStatus = 'bloqueada' | 'pendiente' | 'completada';

export interface MissionDefinition {
  id: MissionId;
  title: string;
  description: string;
  points: number;
}

export interface RankingRow {
  position: number;
  name: string;
  score: number;
  isCurrentUser: boolean;
}
