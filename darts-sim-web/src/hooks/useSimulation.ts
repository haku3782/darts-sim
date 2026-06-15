import { useState, useCallback } from "react";
import type { GameRule, SimulationRecord, SimulationParams } from "../types/simulation";
import { BOARD_X_MAP } from "../constants";

const API_BASE = import.meta.env.VITE_API_BASE as string;

interface FetchHistoryOptions {
  /** true のとき最新レコードをアニメーション対象として通知 */
  animateNewest?: boolean;
  /** animateNewest=true かつ新規レコードが存在するとき、そのIDで呼ばれるコールバック */
  onNewRecord?: (id: number) => void;
  /** 初回ロード時に全IDリストで呼ばれるコールバック（全非表示の初期化に使用） */
  onInitialLoad?: (ids: number[]) => void;
}

export function useSimulation() {
  const [history, setHistory] = useState<SimulationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /** 履歴を取得する */
  const fetchHistory = useCallback(async (opts: FetchHistoryOptions = {}) => {
    try {
      const response = await fetch(`${API_BASE}/history`, { credentials: "include" });
      if (response.ok) {
        const data: SimulationRecord[] = await response.json();
        setHistory(data);
        if (opts.animateNewest && data.length > 0) {
          opts.onNewRecord?.(data[0].id);
        }
        opts.onInitialLoad?.(data.map(r => r.id));
      }
    } catch (error) {
      console.error("履歴の取得に失敗しました", error);
    }
  }, []);

  /** シミュレーションを実行し、完了後に onSuccess を呼ぶ */
  const runSimulation = useCallback(async (
    params: SimulationParams,
    onSuccess?: () => void,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          gameRule: params.gameRule,
          dartSetting: {
            weight:          params.weight,
            centerOfGravity: 0.5,
            flightShape:     params.flightShape,
            barrelLength:    params.barrelLength,
            shaftLength:     params.shaftLength,
            cgRatio:         params.cgRatio,
            gripRatio:       params.gripRatio,
          },
          throwCondition: {
            speed:           params.speed,
            angle:           params.angle,
            releaseHeight:   params.releaseHeight   / 100,
            releaseDistance: BOARD_X_MAP[params.gameRule] - params.releaseDistance / 100,
            initialPitch:    params.initialPitch,
          },
        }),
      });
      await response.json();
      onSuccess?.();
    } catch (error) {
      console.error("シミュレーションに失敗しました:", error);
      alert("API通信エラーが発生しました。URLやサーバーの状態を確認してください。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 履歴を1件削除する */
  const deleteRecord = useCallback(async (id: number) => {
    try {
      await fetch(`${API_BASE}/history/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("レコードの削除に失敗しました", error);
    }
  }, []);

  /** 指定ルールの履歴を全削除し、完了後に onSuccess を呼ぶ */
  const deleteHistory = useCallback(async (
    gameRule: GameRule,
    onSuccess?: () => void,
  ) => {
    setIsDeleting(true);
    try {
      await fetch(`${API_BASE}/history?gameRule=${gameRule}`, {
        method: "DELETE",
        credentials: "include",
      });
      setHistory(prev => prev.filter(r => r.gameRule !== gameRule));
      onSuccess?.();
    } catch (error) {
      console.error("履歴の削除に失敗しました", error);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    history,
    setHistory,
    isLoading,
    isDeleting,
    fetchHistory,
    runSimulation,
    deleteRecord,
    deleteHistory,
  };
}
