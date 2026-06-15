import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSimulation } from '../hooks/useSimulation';
import type { SimulationParams } from '../types/simulation';

const API_BASE = 'https://darts-sim-api.onrender.com/api';

const mockParams: SimulationParams = {
  gameRule:        'SOFT',
  weight:          20.0,
  speed:           24.0,
  angle:           18.0,
  releaseHeight:   170,
  releaseDistance: 30,
  flightShape:     'STANDARD',
  barrelLength:    45.0,
  shaftLength:     26.0,
  cgRatio:         50.0,
  gripRatio:       51.0,
  initialPitch:    18.0,
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useSimulation - fetchHistory', () => {
  it('正しいURLにGETリクエストを送信する', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({ ok: true, json: async () => [] } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.fetchHistory(); });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/history`,
      { credentials: 'include' }
    );
  });

  it('レスポンスの配列で history が更新される', async () => {
    const mockData = [{ id: 1, gameRule: 'SOFT', trajectoryJson: '[]', initialVelocity: 24, angle: 18, drag: 0, createdAt: '' }];
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockData } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.fetchHistory(); });

    expect(result.current.history).toEqual(mockData);
  });

  it('onInitialLoad に全IDが渡される', async () => {
    const mockData = [
      { id: 1, gameRule: 'SOFT', trajectoryJson: '[]', initialVelocity: 24, angle: 18, drag: 0, createdAt: '' },
      { id: 2, gameRule: 'SOFT', trajectoryJson: '[]', initialVelocity: 22, angle: 16, drag: 0, createdAt: '' },
    ];
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockData } as Response);

    const onInitialLoad = vi.fn();
    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.fetchHistory({ onInitialLoad }); });

    expect(onInitialLoad).toHaveBeenCalledWith([1, 2]);
  });
});

describe('useSimulation - runSimulation', () => {
  it('正しいURLにPOSTリクエストを送信する', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ trajectory: [] }) } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.runSimulation(mockParams); });

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE}/simulate`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('完了後に isLoading が false になる', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ trajectory: [] }) } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.runSimulation(mockParams); });

    expect(result.current.isLoading).toBe(false);
  });

  it('onSuccess コールバックが呼ばれる', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ trajectory: [] }) } as Response);

    const onSuccess = vi.fn();
    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.runSimulation(mockParams, onSuccess); });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('useSimulation - deleteRecord', () => {
  it('正しいURLにDELETEリクエストを送信する', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.deleteRecord(42); });

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/history/42`,
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('削除後に history から該当IDが除外される', async () => {
    const mockData = [
      { id: 1, gameRule: 'SOFT', trajectoryJson: '[]', initialVelocity: 24, angle: 18, drag: 0, createdAt: '' },
      { id: 2, gameRule: 'SOFT', trajectoryJson: '[]', initialVelocity: 22, angle: 16, drag: 0, createdAt: '' },
    ];
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => mockData } as Response)
      .mockResolvedValueOnce({ ok: true } as Response);

    const { result } = renderHook(() => useSimulation());
    await act(async () => { await result.current.fetchHistory(); });
    await act(async () => { await result.current.deleteRecord(1); });

    expect(result.current.history.map(r => r.id)).toEqual([2]);
  });
});
