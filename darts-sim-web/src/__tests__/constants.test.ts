import { describe, it, expect } from 'vitest';
import { COLORS, BOARD_X_MAP, FLIGHT_SHAPE_JP } from '../constants';

describe('COLORS', () => {
  it('7色定義されている', () => {
    expect(COLORS).toHaveLength(7);
  });

  it('すべて有効な16進カラーコード', () => {
    COLORS.forEach(c => expect(c).toMatch(/^#[0-9a-fA-F]{6}$/));
  });

  it('重複した色がない', () => {
    const unique = new Set(COLORS);
    expect(unique.size).toBe(COLORS.length);
  });
});

describe('BOARD_X_MAP', () => {
  it('SOFTのボード距離は 2.44m（公式ルール）', () => {
    expect(BOARD_X_MAP['SOFT']).toBe(2.44);
  });

  it('HARDのボード距離は 2.37m（公式ルール）', () => {
    expect(BOARD_X_MAP['HARD']).toBe(2.37);
  });

  it('SOFT の距離は HARD より長い', () => {
    expect(BOARD_X_MAP['SOFT']).toBeGreaterThan(BOARD_X_MAP['HARD']);
  });
});

describe('FLIGHT_SHAPE_JP', () => {
  it('5種類のフライト形状が定義されている', () => {
    expect(Object.keys(FLIGHT_SHAPE_JP)).toHaveLength(5);
  });

  it('STANDARD は「スタンダード」', () => {
    expect(FLIGHT_SHAPE_JP['STANDARD']).toBe('スタンダード');
  });

  it('SLIM は「スリム」', () => {
    expect(FLIGHT_SHAPE_JP['SLIM']).toBe('スリム');
  });

  it('すべての値が空文字ではない', () => {
    Object.values(FLIGHT_SHAPE_JP).forEach(v => expect(v.length).toBeGreaterThan(0));
  });
});
