import * as THREE from "three";

export type FlightShapeType = "STANDARD" | "SHAPE" | "KITE" | "TEARDROP" | "SLIM";

// フライト形状ごとの半高さ (m) — 位置計算に使用（実寸×1.36スケール）
export const FLIGHT_HALF_HEIGHT: Record<FlightShapeType, number> = {
  STANDARD: 0.018,
  SHAPE:    0.018,
  KITE:     0.018,
  TEARDROP: 0.016,
  SLIM:     0.018,
};

/**
 * フライト形状の ShapeGeometry を生成する。
 * 座標系：+Y = シャフト側（取付端・上部）、−Y = 後端（トレーリングエッジ・下部）
 * 実寸に合わせて×1.36スケール（STANDARD幅 28mm → 38mm）
 */
export function createFlightShape(type: FlightShapeType): THREE.BufferGeometry {
  const s = new THREE.Shape();

  switch (type) {
    case "STANDARD": {
      // 六角形フライト（スタンダード）幅38mm × 高37mm
      s.moveTo(-0.0025,  0.018);
      s.lineTo( 0.0025,  0.018);
      s.lineTo( 0.017,  0.007);
      s.quadraticCurveTo( 0.019,  0.005,  0.019,  0.002);
      s.lineTo( 0.019, -0.009);
      s.quadraticCurveTo( 0.019, -0.012,  0.017, -0.014);
      s.lineTo( 0,     -0.019);
      s.lineTo(-0.017, -0.014);
      s.quadraticCurveTo(-0.019, -0.012, -0.019, -0.009);
      s.lineTo(-0.019,  0.002);
      s.quadraticCurveTo(-0.019,  0.005, -0.017,  0.007);
      s.closePath();
      break;
    }

    case "SHAPE": {
      // シェイプ型：スタンダードより細身　幅33mm × 高37mm
      s.moveTo(-0.0025,  0.018);
      s.lineTo( 0.0025,  0.018);
      s.lineTo( 0.014,  0.007);
      s.quadraticCurveTo( 0.016,  0.005,  0.016,  0.002);
      s.lineTo( 0.016, -0.009);
      s.quadraticCurveTo( 0.016, -0.012,  0.014, -0.014);
      s.lineTo( 0,     -0.019);
      s.lineTo(-0.014, -0.014);
      s.quadraticCurveTo(-0.016, -0.012, -0.016, -0.009);
      s.lineTo(-0.016,  0.002);
      s.quadraticCurveTo(-0.016,  0.005, -0.014,  0.007);
      s.closePath();
      break;
    }

    case "KITE": {
      // カイト型：全辺直線・2番目コーナー丸め　幅38mm × 高37mm
      s.moveTo(-0.0025,  0.018);
      s.lineTo( 0.0025,  0.018);
      s.lineTo( 0.014, -0.009);
      s.quadraticCurveTo( 0.016, -0.012,  0.013, -0.013);
      s.lineTo( 0,     -0.019);
      s.lineTo(-0.013, -0.013);
      s.quadraticCurveTo(-0.016, -0.012, -0.014, -0.009);
      s.closePath();
      break;
    }

    case "TEARDROP": {
      // ティア型：上部シャープ、後方楕円　幅32mm × 高36mm
      const w = 0.013, ht = 0.016, hb = 0.020;
      s.moveTo(0, ht);
      s.bezierCurveTo( w * 0.3,  ht,         w,  ht * 0.4,   w,    0);
      s.bezierCurveTo( w,       -hb * 0.7,   w * 0.6, -hb,   0,  -hb);
      s.bezierCurveTo(-w * 0.6, -hb,        -w, -hb * 0.7,  -w,   0);
      s.bezierCurveTo(-w,        ht * 0.4,  -w * 0.3, ht,    0,   ht);
      s.closePath();
      break;
    }

    case "SLIM": {
      // スリム型：幅を絞ってスリムに　幅22mm × 高37mm
      s.moveTo(-0.0025,  0.018);
      s.lineTo( 0.0025,  0.018);
      s.lineTo( 0.009,  0.012);
      s.quadraticCurveTo( 0.011,  0.010,  0.011,  0.007);
      s.lineTo( 0.011, -0.011);
      s.quadraticCurveTo( 0.011, -0.014,  0.009, -0.016);
      s.lineTo( 0,     -0.019);
      s.lineTo(-0.009, -0.016);
      s.quadraticCurveTo(-0.011, -0.014, -0.011, -0.011);
      s.lineTo(-0.011,  0.007);
      s.quadraticCurveTo(-0.011,  0.010, -0.009,  0.012);
      s.closePath();
      break;
    }

    default: {
      const w = 0.019, h = 0.018;
      s.moveTo(0, h);
      s.bezierCurveTo( w * 0.55,  h,        w,  h * 0.55,  w,   0);
      s.bezierCurveTo( w,        -h * 0.6,   w * 0.65, -h,  0,  -h);
      s.bezierCurveTo(-w * 0.65, -h,        -w, -h * 0.6,  -w,   0);
      s.bezierCurveTo(-w,         h * 0.55, -w * 0.55, h,   0,   h);
      s.closePath();
    }
  }

  return new THREE.ShapeGeometry(s);
}
