// 軌道ごとの色
export const COLORS = ["#ff4d4d", "#4dff91", "#ffd84d", "#4db8ff", "#ff944d", "#d44dff", "#ff4da6"];

// ルールごとのボード固定距離（スローラインからボードまでの公式距離）
export const BOARD_X_MAP: Record<string, number> = { SOFT: 2.44, HARD: 2.37 };

// フライト形状の英語→日本語マッピング
export const FLIGHT_SHAPE_JP: Record<string, string> = {
  STANDARD: "スタンダード",
  SHAPE:    "シェイプ",
  TEARDROP: "ティアドロップ",
  KITE:     "カイト",
  SLIM:     "スリム",
};
