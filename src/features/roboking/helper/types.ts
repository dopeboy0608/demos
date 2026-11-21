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
