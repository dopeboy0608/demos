export interface TopRankingEntry {
  thumb: string;
  id: string;
  score: number;
}

export interface HombotWinner {
  thumb: string;
  id: string;
}

export interface PrizeWinner {
  thumb: string;
  id: string;
  date: string;
}

export interface TopWinnerList {
  top: TopRankingEntry[];
  hombotWinner: HombotWinner;
  prizeWinner: PrizeWinner[];
}

export type RobotDirection = 'left' | 'right' | 'up' | 'down' | 'stop';

export interface Friend {
  bigThumb: string;
  smallThumb: string;
  id: string;
  key: number;
}

export interface FriendsList {
  myphoto: string;
  friend: Friend[];
}

export interface RegisterResponse {
  result: 'ok';
  win: boolean;
  totalScore: number;
}

export interface RecommendResponse {
  result: 'ok';
}
