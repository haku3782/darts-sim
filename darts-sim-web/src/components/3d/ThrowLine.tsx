interface ThrowLineProps {
  x: number; // スローラインのX位置
}

// スローライン：指定X位置に床上の線を描画
export default function ThrowLine({ x }: ThrowLineProps) {
  return (
    <mesh position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.03, 1.5]} />
      <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={1.5} />
    </mesh>
  );
}
