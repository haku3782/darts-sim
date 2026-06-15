import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  FLIGHT_HALF_HEIGHT,
  createFlightShape,
  type FlightShapeType,
} from '../components/3d/flightShapeGeometry';

const SHAPES: FlightShapeType[] = ['STANDARD', 'SHAPE', 'KITE', 'TEARDROP', 'SLIM'];

describe('FLIGHT_HALF_HEIGHT', () => {
  it('5種類すべて定義されている', () => {
    expect(Object.keys(FLIGHT_HALF_HEIGHT)).toHaveLength(5);
  });

  it('すべての値が正の数', () => {
    SHAPES.forEach(shape => {
      expect(FLIGHT_HALF_HEIGHT[shape]).toBeGreaterThan(0);
    });
  });

  it('値が実際のフライトサイズ範囲内（10〜25mm）', () => {
    SHAPES.forEach(shape => {
      expect(FLIGHT_HALF_HEIGHT[shape]).toBeGreaterThanOrEqual(0.010);
      expect(FLIGHT_HALF_HEIGHT[shape]).toBeLessThanOrEqual(0.025);
    });
  });

  it('TEARDROP は SLIM より小さい半高さ', () => {
    expect(FLIGHT_HALF_HEIGHT['TEARDROP']).toBeLessThan(FLIGHT_HALF_HEIGHT['SLIM']);
  });
});

describe('createFlightShape', () => {
  it('各形状で BufferGeometry が返される', () => {
    SHAPES.forEach(shape => {
      const geo = createFlightShape(shape);
      expect(geo).toBeInstanceOf(THREE.BufferGeometry);
    });
  });

  it('position アトリビュートが存在する', () => {
    SHAPES.forEach(shape => {
      const geo = createFlightShape(shape);
      expect(geo.attributes.position).toBeDefined();
    });
  });

  it('頂点数が1以上', () => {
    SHAPES.forEach(shape => {
      const geo = createFlightShape(shape);
      expect(geo.attributes.position.count).toBeGreaterThan(0);
    });
  });

  it('形状ごとに異なるジオメトリが返される', () => {
    const counts = SHAPES.map(shape =>
      createFlightShape(shape).attributes.position.count
    );
    // 少なくとも1種類は異なる頂点数を持つ
    const unique = new Set(counts);
    expect(unique.size).toBeGreaterThan(1);
  });
});
