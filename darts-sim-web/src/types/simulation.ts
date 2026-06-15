export type GameRule = "SOFT" | "HARD";
export type FlightShape = "STANDARD" | "SHAPE" | "TEARDROP" | "KITE" | "SLIM";

export interface TrajectoryPoint {
  time: number;
  x: number;
  y: number;
  z: number;
}

export interface SimulationParams {
  gameRule: GameRule;
  weight: number;
  speed: number;
  angle: number;
  releaseHeight: number;   // cm
  releaseDistance: number; // cm（スローラインからボード方向への踏み込み距離）
  flightShape: FlightShape;
  barrelLength: number;
  shaftLength: number;
  cgRatio: number;
  gripRatio: number;
  initialPitch: number;
}

export interface SimulationRecord {
  id: number;
  initialVelocity: number;
  angle: number;
  drag: number;
  createdAt: string;
  trajectoryJson: string;
  releaseDistance: number;
  gameRule: string;
  // セッティング条件
  flightShape?: string;
  barrelLength?: number;
  shaftLength?: number;
  weight?: number;
  cgRatio?: number;
  // スロー条件
  gripRatio?: number;
  releaseHeight?: number;
  initialPitch?: number;
}
