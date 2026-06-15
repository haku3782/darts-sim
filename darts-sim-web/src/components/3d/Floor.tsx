interface FloorProps {
  centerX: number; // スローラインとボードの中間X
  color?: string;
  basic?: boolean; // true のとき meshBasicMaterial（ライティング無視）
  emissive?: string;
  emissiveIntensity?: number;
}

export default function Floor({ centerX, color = "#373737", basic = false, emissive = "#000000", emissiveIntensity = 0.7 }: FloorProps) {
  return (
    <mesh position={[centerX, -0.15, 0]}>
      <boxGeometry args={[5, 0.3, 3]} />
      {basic
        ? <meshBasicMaterial color={color} />
        : <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} />
      }
    </mesh>
  );
}
