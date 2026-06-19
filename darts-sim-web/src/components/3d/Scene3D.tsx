import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useMemo } from "react";
import { createFlightShape, FLIGHT_HALF_HEIGHT, type FlightShapeType } from "./flightShapeGeometry";
import Floor from "./Floor";
import ThrowLine from "./ThrowLine";
import Dartboard from "./Dartboard";
import DartTrajectory from "./DartTrajectory";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { BREAKPOINTS } from "../../constants/breakpoints";

interface TrajectoryPoint {
  time: number;
  x: number;
  y: number;
  z: number;
  pitch?: number; // 姿勢角 (ラジアン)
}

interface TrajectoryData {
  id: number;
  points: TrajectoryPoint[];
  color: string;
  xOffset: number;
  instantDisplay?: boolean;
  onComplete?: () => void;
  barrelLength?: number;
  shaftLength?: number;
  flightShape?: FlightShapeType;
  cgRatio?: number;
}

type GameRule = "SOFT" | "HARD";

interface Scene3DProps {
  trajectories: TrajectoryData[];
  releaseDistance: number;
  releaseHeight: number;
  gameRule: GameRule;
  cameraZ: number;
  cameraY: number;
  flightShape: FlightShapeType; // フライト形状
  barrelLength: number;         // バレル長 (mm)
  shaftLength: number;          // シャフト長 (mm)
  initialPitch: number;         // 初期姿勢角 (度)
  cgRatio: number;              // 重心位置 (バレル先端からの %)
  gripRatio: number;            // グリップ位置 (バレル先端からの %)
  releaseColor: string;         // 起点ダーツのフライト色（次スローの軌道色と一致）
  playbackSpeed: number;        // 再生速度倍率
  isPlaying: boolean;           // 再生中フラグ
  restartKey: number;           // 再生リセットシグナル
  canvasBg?: string;            // キャンバス背景色
  surfaceColor?: string;        // 床・壁の色
  isDark?: boolean;             // ダークモードフラグ（床・壁のマテリアル切替に使用）
  onHorizontalScroll?: (deltaX: number) => void; // 二本指左右スクロール
  onVerticalScroll?: (deltaY: number) => void;   // 二本指上下スクロール
}

// ルールごとのボード固定距離（スローラインからボードまでの公式距離）
const BOARD_X: Record<GameRule, number> = {
  SOFT: 2.44,
  HARD: 2.37,
};

// ルールごとの公式スローライン位置
const OFFICIAL_DISTANCE: Record<GameRule, number> = {
  SOFT: 2.44,
  HARD: 2.37,
};
const THROW_LINE_X: Record<GameRule, number> = {
  SOFT: BOARD_X.SOFT - OFFICIAL_DISTANCE.SOFT,  // 0
  HARD: BOARD_X.HARD - OFFICIAL_DISTANCE.HARD,  // 0
};

// カメラ・ターゲットを差分で平行移動するコントローラー
function PanController({
  xOffset,
  yOffset,
  orbitRef,
}: {
  xOffset: number;
  yOffset: number;
  orbitRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const prevXOffset = useRef(0);
  const prevYOffset = useRef(0);

  useEffect(() => {
    const dx = xOffset - prevXOffset.current;
    const dy = yOffset - prevYOffset.current;
    camera.position.x += dx;
    camera.position.y += dy;
    if (orbitRef.current) {
      orbitRef.current.target.x += dx;
      orbitRef.current.target.y += dy;
      orbitRef.current.update();
    }
    prevXOffset.current = xOffset;
    prevYOffset.current = yOffset;
  }, [xOffset, yOffset]);

  return null;
}

export default function Scene3D({ trajectories, releaseDistance, releaseHeight, gameRule, cameraZ, cameraY, flightShape, barrelLength, shaftLength, initialPitch, cgRatio, gripRatio, releaseColor, playbackSpeed, isPlaying, restartKey, canvasBg = "#1a1a2e", surfaceColor = "#373737", isDark = true, onHorizontalScroll, onVerticalScroll }: Scene3DProps) {
  const isMobile = useWindowWidth() < BREAKPOINTS.MD;
  const boardX = BOARD_X[gameRule];
  const throwLineX = THROW_LINE_X[gameRule];
  const orbitRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchMidRef = useRef<{ x: number; y: number } | null>(null);

  // カメラ回転の中心：公式スローラインとボードの中央、ブルの高さ
  const centerX = (throwLineX + boardX) / 2;
  // 初回マウント時の値を固定（ルール切替で回転中心がジャンプしないよう）
  const initialCenterX = useRef(centerX);

  // 起点ダーツの計算（y=0 = CG = 軌道基準点）
  const pitchRad = initialPitch * (Math.PI / 180);
  const barrelLengthM  = barrelLength / 1000;
  const shaftLengthM   = shaftLength / 1000;
  const flightHalf     = FLIGHT_HALF_HEIGHT[flightShape];
  const barrelTopY    = (cgRatio   / 100) * barrelLengthM;   // CG → バレル上端
  const barrelBottomY = barrelTopY - barrelLengthM;          // CG → バレル下端
  const barrelCenterY = barrelTopY - barrelLengthM / 2;      // バレル中心
  const shaftCenterY  = barrelBottomY - shaftLengthM / 2;    // シャフト中心
  const flightCenterY = barrelBottomY - shaftLengthM - flightHalf; // フライト中心
  const yCg           = 0;                                   // 定義上 原点 = CG
  const yGrip         = (cgRatio - gripRatio) / 100 * barrelLengthM; // CG → グリップ
  // タッチパッドスクロール → 視点左右・上下（横取り）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey) return; // ピンチズーム → OrbitControls へ通す
      e.preventDefault();
      e.stopPropagation();
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
        onHorizontalScroll?.(e.deltaX);
      } else {
        onVerticalScroll?.(e.deltaY);
      }
    };
    el.addEventListener('wheel', handler, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', handler, { capture: true });
  }, [onHorizontalScroll, onVerticalScroll]);

  // 2本指タッチパン → 視点左右・上下（スマホ実機）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchMidRef.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      } else {
        touchMidRef.current = null;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !touchMidRef.current) return;
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const dx = midX - touchMidRef.current.x;
      const dy = midY - touchMidRef.current.y;
      onHorizontalScroll?.(-dx);
      onVerticalScroll?.(-dy);
      touchMidRef.current = { x: midX, y: midY };
    };
    const onTouchEnd = () => { touchMidRef.current = null; };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [onHorizontalScroll, onVerticalScroll]);

  // フライト形状 geometry
  const flightGeo = useMemo(() => createFlightShape(flightShape), [flightShape]);
  const target: [number, number, number] = [initialCenterX.current, 1.73, 0];

  return (
    <div ref={containerRef} className="scene-canvas">
    <Canvas
      camera={{ position: [centerX, 1.7, 3], fov: 50 }}
      style={{ width: "100%", height: "100%", background: canvasBg }}
    >
      {/* ライティング */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} />

      {/* 平行移動コントローラー */}
      <PanController xOffset={cameraZ} yOffset={cameraY} orbitRef={orbitRef} />
      {/* カメラコントロール */}
      <OrbitControls ref={orbitRef} target={target} enableDamping={false} zoomSpeed={0.5} enablePan={false} rotateSpeed={isMobile ? 0.4 : 1.0} />

      {/* シーン */}
      <Floor centerX={initialCenterX.current} color={surfaceColor} basic={false}
        emissive={isDark ? "#000000" : "#ffffff"} emissiveIntensity={isDark ? 0 : 0.7} />
      {/* 壁（厚さ20cm） */}
      <mesh position={[boardX + 0.140, 1.5, 0]}>
        <boxGeometry args={[0.2, 3.0, 2.5]} />
        <meshStandardMaterial color={surfaceColor}
          emissive={isDark ? "#000000" : "#ffffff"} emissiveIntensity={isDark ? 0 : 0.7} />
      </mesh>
      <ThrowLine x={throwLineX} />

      {/* 起点ダーツ（初期姿勢・重心・グリップをリアルタイム反映） */}
      {/* rotation: ローカル+Y=ノーズ方向、Z軸回転で pitch を表現 */}
      <group
        position={[releaseDistance, releaseHeight, 0]}
        rotation={[0, 0, pitchRad - Math.PI / 2]}
      >
        {/* チップ */}
        <mesh position={[0, barrelTopY + 0.015, 0]}>
          <coneGeometry args={[0.003, 0.03, 12]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.2} roughness={0.2} />
        </mesh>
        {/* バレル（長さ動的） */}
        <mesh position={[0, barrelCenterY, 0]}>
          <cylinderGeometry args={[0.004, 0.003, barrelLengthM, 12]} />
          <meshStandardMaterial color="#f0f0f0" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* シャフト（長さ動的） */}
        <mesh position={[0, shaftCenterY, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, shaftLengthM, 8]} />
          <meshStandardMaterial color="#303030" metalness={0.1} roughness={0.7} />
        </mesh>
        {/* フライト（十字2枚・形状・位置ともに動的） */}
        <mesh geometry={flightGeo} position={[0, flightCenterY, 0]}>
          <meshStandardMaterial color={releaseColor} opacity={0.75} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={flightGeo} position={[0, flightCenterY, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color={releaseColor} opacity={0.75} transparent side={THREE.DoubleSide} />
        </mesh>
        {/* 重心マーカー（オレンジ・リング）*/}
        <mesh position={[0, yCg, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.0037, 0.0005, 8, 32]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={0.4} />
        </mesh>
        {/* グリップ位置マーカー（シアン・リング）*/}
        <mesh position={[0, yGrip, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.0037, 0.0005, 8, 32]} />
          <meshStandardMaterial color="#00ccff" emissive="#0088ff" emissiveIntensity={0.4} />
        </mesh>
      </group>
      <Dartboard x={boardX} gameRule={gameRule} isDark={isDark} />

      {/* 軌道 + ダーツアニメーション */}
      {trajectories.map((t) => (
        <DartTrajectory key={t.id} points={t.points} color={t.color} xOffset={t.xOffset} flightShape={t.flightShape ?? flightShape} barrelLength={t.barrelLength} shaftLength={t.shaftLength} cgRatio={t.cgRatio} playbackSpeed={playbackSpeed} isPlaying={isPlaying} restartKey={restartKey} instantDisplay={t.instantDisplay} onComplete={t.instantDisplay ? undefined : t.onComplete} isDark={isDark} />
      ))}

    </Canvas>
    </div>
  );
}
