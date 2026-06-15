import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme';

describe('useTheme - 初期状態', () => {
  it('初期状態はダークモード', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
  });

  it('isDark と setIsDark が返される', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDark).toBeDefined();
    expect(result.current.setIsDark).toBeTypeOf('function');
    expect(result.current.C).toBeDefined();
  });
});

describe('useTheme - ダークモードのカラー', () => {
  it('pageBg が暗い色', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.C.pageBg).toBe('#0f0f1a');
  });

  it('panelBg が正しい', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.C.panelBg).toBe('#1a1a2e');
  });

  it('text が明るい色', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.C.text).toBe('#e0e0e0');
  });

  it('deleteText が赤系', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.C.deleteText).toBe('#cc6666');
  });
});

describe('useTheme - ライトモードへの切り替え', () => {
  it('setIsDark(false) でライトモードに切り替わる', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.setIsDark(false); });
    expect(result.current.isDark).toBe(false);
  });

  it('ライトモードの pageBg が明るい色', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.setIsDark(false); });
    expect(result.current.C.pageBg).toBe('#eef0f8');
  });

  it('ライトモードの panelBg が正しい', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.setIsDark(false); });
    expect(result.current.C.panelBg).toBe('#ffffff');
  });

  it('ライトモードの text が暗い色', () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.setIsDark(false); });
    expect(result.current.C.text).toBe('#1e2040');
  });

  it('ダーク/ライトで pageBg が異なる', () => {
    const { result } = renderHook(() => useTheme());
    const darkBg = result.current.C.pageBg;
    act(() => { result.current.setIsDark(false); });
    expect(result.current.C.pageBg).not.toBe(darkBg);
  });
});
