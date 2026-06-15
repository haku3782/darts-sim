import { useMemo } from "react";
import * as THREE from "three";

type GameRule = "SOFT" | "HARD";

interface DartboardProps {
  x: number;
  gameRule: GameRule;
  isDark?: boolean;
}

// セグメント順（上から時計回り）
const SEGMENTS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

// ルールごとのボード半径 (m)
const BOARD_RADIUS: Record<GameRule, number> = {
  SOFT: 0.197,
  HARD: 0.170,
};

// ルールごとの各リング半径 (mm → 比率)
const RING_RATIO: Record<GameRule, {
  bull: number;
  outerBull: number;
  tripleInner: number;
  tripleOuter: number;
  doubleInner: number;
}> = {
  SOFT: {
    bull:        8.1  / 197.0,
    outerBull:   21.5 / 197.0,
    tripleInner: 104.0 / 197.0,
    tripleOuter: 120.0 / 197.0,
    doubleInner: 180.0 / 197.0,
  },
  HARD: {
    bull:        6.35  / 170.0,
    outerBull:   15.9  / 170.0,
    tripleInner: 99.0  / 170.0,
    tripleOuter: 107.0 / 170.0,
    doubleInner: 162.0 / 170.0,
  },
};

// セクター描画ヘルパー
function drawSector(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  innerR: number, outerR: number,
  startAngle: number, endAngle: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, startAngle, endAngle);
  ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// ダーツボードテクスチャを生成（数字なし）
function createDartboardTexture(gameRule: GameRule, size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const ratio = RING_RATIO[gameRule];

  // 背景（黒）
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, size, size);

  const segAngle = (Math.PI * 2) / 20;
  const startOffset = -Math.PI / 2 - segAngle / 2;

  SEGMENTS.forEach((_, i) => {
    const a1 = startOffset + i * segAngle;
    const a2 = a1 + segAngle;
    const isEven = i % 2 === 0;

    const singleColor = isEven ? "#1a1a1a" : "#f5e6c8";
    const green       = gameRule === "SOFT" ? "#0055cc" : "#006600";
    const ringColor   = isEven ? "#cc0000" : green;

    drawSector(ctx, cx, cy, r * ratio.outerBull,   r * ratio.tripleInner, a1, a2, singleColor);
    drawSector(ctx, cx, cy, r * ratio.tripleInner, r * ratio.tripleOuter, a1, a2, ringColor);
    drawSector(ctx, cx, cy, r * ratio.tripleOuter, r * ratio.doubleInner, a1, a2, singleColor);
    drawSector(ctx, cx, cy, r * ratio.doubleInner, r,                     a1, a2, ringColor);
  });

  // アウターブル（SOFT:赤 / HARD:緑）
  ctx.beginPath();
  ctx.arc(cx, cy, r * ratio.outerBull, 0, Math.PI * 2);
  ctx.fillStyle = gameRule === "SOFT" ? "#cc0000" : "#006600";
  ctx.fill();

  // インブル（SOFT:黒 / HARD:赤）
  ctx.beginPath();
  ctx.arc(cx, cy, r * ratio.bull, 0, Math.PI * 2);
  ctx.fillStyle = gameRule === "SOFT" ? "#111111" : "#cc0000";
  ctx.fill();

  // セグメント境界線
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 2;
  SEGMENTS.forEach((_, i) => {
    const angle = startOffset + i * segAngle;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * ratio.outerBull, cy + Math.sin(angle) * r * ratio.outerBull);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();
  });

  // リング境界線
  [ratio.outerBull, ratio.tripleInner, ratio.tripleOuter, ratio.doubleInner, 1.0].forEach(rr => {
    ctx.beginPath();
    ctx.arc(cx, cy, r * rr, 0, Math.PI * 2);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  return new THREE.CanvasTexture(canvas);
}

// 外周リングテクスチャを生成（黒リング + 数字）
function createOuterRingTexture(gameRule: GameRule, isDark = true, size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2;
  const innerFrac = 0.82; // ボード半径 / 外周半径

  // 透明でクリア
  ctx.clearRect(0, 0, size, size);

  // 黒い外周リング（ドーナツ形）
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.arc(cx, cy, r * innerFrac, 0, Math.PI * 2, true);
  ctx.fillStyle = "#1a1a1a";
  ctx.fill("evenodd");

  // 数字（外周リング中央）
  const numR = r * (innerFrac + 1.0) / 2;
  const segAngle = (Math.PI * 2) / 20;
  const startOffset = -Math.PI / 2 - segAngle / 2;
  const fontSize = Math.round(size * (gameRule === "SOFT" ? 0.065 : 0.068));
  ctx.font = gameRule === "SOFT"
    ? `bold ${fontSize}px Arial`
    : `100 ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  SEGMENTS.forEach((num, i) => {
    const angle = startOffset + (i + 0.5) * segAngle;
    const nx = cx + Math.cos(angle) * numR;
    const ny = cy + Math.sin(angle) * numR;
    ctx.fillStyle = isDark ? (gameRule === "SOFT" ? "#ffffff" : "#e8eef2") : "#ffffff";
    ctx.fillText(String(num), nx, ny);
  });

  return new THREE.CanvasTexture(canvas);
}

export default function Dartboard({ x, gameRule, isDark = true }: DartboardProps) {
  const radius      = BOARD_RADIUS[gameRule];
  const outerRadius = radius * 1.22;
  const texture          = useMemo(() => createDartboardTexture(gameRule), [gameRule]);
  const outerRingTexture = useMemo(() => createOuterRingTexture(gameRule, isDark), [gameRule, isDark]);

  return (
    <group position={[x + 0.020, 1.73, 0]}>
      {/* ボード本体（テクスチャ付き）：厚さ 4cm */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, 0.040, 64]} />
        <meshStandardMaterial map={texture} emissive="#ffffff" emissiveIntensity={isDark ? 0 : 0.02} />
      </mesh>
      {/* ボード側面（黒） */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, 0.040, 64, 1, true]} />
        <meshStandardMaterial color="#111111" side={THREE.BackSide} />
      </mesh>
      {/* ボード背面（黒い円板） */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.029, 0, 0]}>
        <circleGeometry args={[outerRadius, 64]} />
        <meshStandardMaterial color="#111111" side={THREE.DoubleSide} />
      </mesh>
      {/* 外周リング（黒 + 数字、ボード前面に平置き） */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[-0.020, 0, 0]}>
        <circleGeometry args={[outerRadius, 128]} />
        <meshStandardMaterial map={outerRingTexture} transparent alphaTest={0.1} side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={isDark ? 0 : 0.02} />
      </mesh>
      {/* ボード外周リム（壁との境界を明確にする薄いメタリックリング） */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[-0.020, 0, 0]}>
        <torusGeometry args={[outerRadius, 0.003, 16, 128]} />
        <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* マウント：外周リングと壁の隙間を埋める円筒シェル */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.005, 0, 0]}>
        <cylinderGeometry args={[outerRadius, outerRadius, 0.049, 64, 1, true]} />
        <meshStandardMaterial color="#404040" side={THREE.DoubleSide} emissive="#ffffff" emissiveIntensity={isDark ? 0 : 0.02} />
      </mesh>
    </group>
  );
}
