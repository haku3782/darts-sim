import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createFlightShape, FLIGHT_HALF_HEIGHT, type FlightShapeType } from "./flightShapeGeometry";

interface TrajectoryPoint {
  time: number;
  x: number;
  y: number;
  z: number;
  pitch?: number; // 姿勢角 (ラジアン)。null/undefined 時は進行方向で代替
}

interface DartTrajectoryProps {
  points: TrajectoryPoint[];
  color: string;
  xOffset: number;
  flightShape?: FlightShapeType;
  playbackSpeed?: number;    // 再生速度倍率（1.0=等速, 0.1=10倍スロー）
  isPlaying?: boolean;       // 再生中かどうか
  restartKey?: number;       // 変化するたびに先頭から再生
  instantDisplay?: boolean;  // true のとき即座に最終位置で表示（アニメなし）
  onComplete?: () => void;   // アニメーション完了時に1度だけ呼ばれるコールバック
  barrelLength?: number;     // バレル長 (mm)
  shaftLength?: number;      // シャフト長 (mm)
  cgRatio?: number;          // 重心位置 (バレル先端からの %)
  isDark?: boolean;          // ダークモード時は軌道色を白補間（グロー効果）
}

export default function DartTrajectory({
  points, color, xOffset,
  flightShape = "STANDARD",
  playbackSpeed = 1.0,
  isPlaying = true,
  restartKey = 0,
  instantDisplay = false,
  onComplete,
  barrelLength = 45,
  shaftLength = 45,
  cgRatio = 50,
  isDark = true,
}: DartTrajectoryProps) {
  const dartRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const hasCompletedRef = useRef(false);

  // restartKey が変わったら elapsed と完了フラグをリセット
  useEffect(() => {
    elapsed.current = 0;
    hasCompletedRef.current = false;
  }, [restartKey]);

  // xOffset を加算した Vector3 配列
  const vectors = useMemo(
    () => points.map((p) => new THREE.Vector3(p.x + xOffset, p.y, p.z)),
    [points, xOffset]
  );

  // フライト形状 geometry
  const flightGeo = useMemo(() => createFlightShape(flightShape), [flightShape]);

  // ダーツ本体の寸法計算（y=0 = CG = 軌道基準点）
  const barrelLengthM = barrelLength / 1000;
  const shaftLengthM  = shaftLength  / 1000;
  const flightHalf    = FLIGHT_HALF_HEIGHT[flightShape];
  const barrelTopY    = (cgRatio / 100) * barrelLengthM;       // CG → バレル上端
  const barrelBottomY = barrelTopY - barrelLengthM;            // CG → バレル下端
  const barrelCenterY = barrelTopY - barrelLengthM / 2;        // バレル中心
  const tipCenterY    = barrelTopY + 0.015;                    // チップ中心
  const shaftCenterY  = barrelBottomY - shaftLengthM / 2;      // シャフト中心
  const flightCenterY = barrelBottomY - shaftLengthM - flightHalf; // フライト中心

  // 軌道色：ダークモードは白補間でグロー感を演出、ライトモードは彩度・明度調整で蛍光感
  const tubeColor = useMemo(() => {
    const c = new THREE.Color(color);
    if (isDark) {
      c.lerp(new THREE.Color("#ffffff"), 0.12);
    } else {
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      c.setHSL(hsl.h, 1.0, Math.min(hsl.l * 1.4, 0.72));
    }
    return "#" + c.getHexString();
  }, [color, isDark]);

  // 軌道チューブ geometry（3層グロー：コア・ミドル・アウター）
  const { tubeCore, tubeMid, tubeOuter } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(vectors);
    const segments = points.length * 2;
    return {
      tubeCore:  new THREE.TubeGeometry(curve, segments, 0.0009, 8, false),
      tubeMid:   new THREE.TubeGeometry(curve, segments, 0.0022, 8, false),
      tubeOuter: new THREE.TubeGeometry(curve, segments, 0.0048, 6, false),
    };
  }, [vectors, points.length]);

  // 実飛行時間（最終点の time）
  const totalDuration = points.length > 0 ? points[points.length - 1].time : 0.5;

  useFrame((_, delta) => {
    // instantDisplay のときは最終フレームに固定
    if (instantDisplay) {
      const lastIdx = points.length - 1;
      if (dartRef.current) {
        dartRef.current.position.copy(vectors[lastIdx]);
        const pitch = points[lastIdx].pitch;
        if (pitch != null) {
          dartRef.current.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(Math.cos(pitch), Math.sin(pitch), 0)
          );
        }
      }
      return;
    }

    // 再生中かつ未終了のときだけ物理時間を進める（delta × speed を直接加算）
    if (isPlaying) {
      if (elapsed.current < totalDuration) {
        elapsed.current += delta * playbackSpeed;
      }
      // 終端に達したら onComplete を1度だけ呼ぶ
      if (elapsed.current >= totalDuration && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    }

    // 物理時間をクランプ
    const physicsTime = Math.min(elapsed.current, totalDuration);

    // physicsTime に対応するフレームインデックスを探す
    let index = 0;
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].time <= physicsTime) index = i;
      else break;
    }
    if (physicsTime >= totalDuration) index = points.length - 1;

    if (dartRef.current) {
      const curr = vectors[index];
      dartRef.current.position.copy(curr);

      const pitch = points[index].pitch;
      if (pitch != null) {
        const noseDir = new THREE.Vector3(Math.cos(pitch), Math.sin(pitch), 0);
        dartRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), noseDir);
      } else if (index < points.length - 1) {
        const next = vectors[index + 1];
        const dir = new THREE.Vector3().subVectors(next, curr).normalize();
        dartRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      }
    }
  });

  return (
    <group>
      {/* 軌道ライン（3層グロー） */}
      <mesh geometry={tubeOuter}>
        <meshStandardMaterial color={tubeColor} opacity={0.15} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={tubeMid}>
        <meshStandardMaterial color={tubeColor} opacity={0.45} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={tubeCore}>
        <meshStandardMaterial color={tubeColor} opacity={0.90} transparent />
      </mesh>

      {/* ダーツ本体（ローカルY軸 = ノーズ方向） */}
      <group ref={dartRef} renderOrder={1}>
        {/* チップ */}
        <mesh position={[0, tipCenterY, 0]}>
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
        {/* フライト（十字2枚） */}
        <mesh geometry={flightGeo} position={[0, flightCenterY, 0]}>
          <meshStandardMaterial color={color} opacity={0.85} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={flightGeo} position={[0, flightCenterY, 0]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color={color} opacity={0.85} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
