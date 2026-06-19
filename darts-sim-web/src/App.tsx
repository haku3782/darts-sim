import React, { useState, useEffect, useRef } from "react";
import Scene3D from "./components/3d/Scene3D";
import type { GameRule, FlightShape } from "./types/simulation";
import { COLORS, BOARD_X_MAP } from "./constants";
import { BREAKPOINTS } from "./constants/breakpoints";
import { useTheme } from "./hooks/useTheme";
import { useSimulation } from "./hooks/useSimulation";
import { useLanguage } from "./hooks/useLanguage";
import { useWindowWidth } from "./hooks/useWindowWidth";
// UI コンポーネント
import ThemeToggle from "./components/ui/ThemeToggle";
import ParamPanel from "./components/ui/ParamPanel";
import PlaybackControls from "./components/ui/PlaybackControls";
import HistoryTable from "./components/ui/HistoryTable";
import LanguageSelector from "./components/ui/LanguageSelector";
// モーダル
import SettingInfoModal from "./components/ui/modals/SettingInfoModal";
import ThrowInfoModal from "./components/ui/modals/ThrowInfoModal";
import DeleteConfirmModal from "./components/ui/modals/DeleteConfirmModal";
import HistoryInfoPopup from "./components/ui/modals/HistoryInfoPopup";


export default function App() {
  // ── パラメータ state ──────────────────────────────────────────────
  const [gameRule, setGameRule]             = useState<GameRule>("SOFT");
  const [flightShape, setFlightShape]       = useState<FlightShape>("SHAPE");
  const [weight, setWeight]                 = useState(20.0);
  const [speed, setSpeed]                   = useState(24.0);
  const [angle, setAngle]                   = useState(18.0);
  const [releaseHeight, setReleaseHeight]   = useState(170);
  const [releaseDistance, setReleaseDistance] = useState(30);
  const [barrelLength, setBarrelLength]     = useState(45.0);
  const [shaftLength, setShaftLength]       = useState(26.0);
  const [cgMm, setCgMm]                     = useState(22.5); // mm（バレル先端から）
  const [gripMm, setGripMm]                 = useState(23.0); // mm（バレル先端から）
  const [initialPitch, setInitialPitch]     = useState(18.0);

  // ── カメラ state ─────────────────────────────────────────────────
  const [cameraZ, setCameraZ] = useState(0);
  const [cameraY, setCameraY] = useState(0);

  // ── アニメーション state ─────────────────────────────────────────
  const [playbackSpeed, setPlaybackSpeed]   = useState(1.0);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [restartKey, setRestartKey]         = useState(0);
  const [animatingIds, setAnimatingIds]     = useState<Set<number>>(new Set());
  const pendingCountRef                     = useRef(0);

  // ── モーダル state ───────────────────────────────────────────────
  const [showSettingInfo, setShowSettingInfo]   = useState(false);
  const [showHistoryInfo, setShowHistoryInfo]   = useState(false);
  const [historyInfoButtonPos, setHistoryInfoButtonPos] = useState<{ top: number; left: number } | null>(null);

  const [showThrowInfo, setShowThrowInfo]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── UI state ─────────────────────────────────────────────────────
  const [page, setPage]                     = useState(1);
  const [deselectedIds, setDeselectedIds]   = useState<Set<number>>(new Set());

  // ── Hooks ────────────────────────────────────────────────────────
  const { isDark, setIsDark, C } = useTheme();
  const { lang, changeLang, t, langList } = useLanguage();
  const isMobile = useWindowWidth() < BREAKPOINTS.MD;
  const {
    history, isLoading, isDeleting,
    fetchHistory,
    runSimulation: apiRunSimulation,
    deleteRecord: apiDeleteRecord,
    deleteHistory: apiDeleteHistory,
  } = useSimulation();

  // ── 初回ロード ───────────────────────────────────────────────────
  useEffect(() => {
    fetchHistory({ onInitialLoad: (ids) => setDeselectedIds(new Set(ids)) });
  }, []);

  // ── 表示/非表示トグル ────────────────────────────────────────────
  const isSelected  = (id: number) => !deselectedIds.has(id);
  const toggleSelect = (id: number) => {
    const wasHidden = deselectedIds.has(id);
    setDeselectedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
    if (wasHidden) setAnimatingIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  // ── 削除ハンドラ ─────────────────────────────────────────────────
  const deleteRecord = async (id: number) => {
    await apiDeleteRecord(id);
    setDeselectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };
  const deleteHistory = () => {
    const ids = history.filter(r => r.gameRule === gameRule).map(r => r.id);
    apiDeleteHistory(gameRule, () => {
      setDeselectedIds(prev => { const s = new Set(prev); ids.forEach(id => s.delete(id)); return s; });
      setShowDeleteConfirm(false);
    });
  };

  // ── アニメーション完了コールバック ──────────────────────────────
  const handleDartComplete = React.useCallback(() => {
    pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
    if (pendingCountRef.current === 0) {
      setIsPlaying(false);
      setAnimatingIds(new Set());
    }
  }, []);

  // ── シミュレーション実行 ─────────────────────────────────────────
  const runSimulation = () => {
    apiRunSimulation(
      { gameRule, weight, speed, angle, releaseHeight, releaseDistance,
        flightShape, barrelLength, shaftLength, cgRatio: cgMm / barrelLength * 100, gripRatio: gripMm / barrelLength * 100, initialPitch },
      () => {
        fetchHistory({
          animateNewest: true,
          onNewRecord: (id) => {
            pendingCountRef.current += 1;
            setAnimatingIds(prev => new Set([...prev, id]));
            setIsPlaying(true);
          },
        });
        setPage(1);
      },
    );
  };

  const filteredHistory = history.filter(r => r.gameRule === gameRule);

  return (
    <div className="app-root" style={{ background: C.pageBg, color: C.text }}>

      {/* ヘッダー */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: isMobile ? "8px" : undefined, marginBottom: "16px" }}>
        <h2 style={{ color: C.textTitle, textShadow: isDark ? "0 0 20px rgba(160, 180, 220, 0.5)" : "none", letterSpacing: "0.1em", fontWeight: "600", margin: 0 }}>
          {t('appTitle')}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: isMobile ? "flex-end" : undefined }}>
          <LanguageSelector lang={lang} langList={langList} onChange={changeLang} C={C} />
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(v => !v)} C={C} />
        </div>
      </div>

      {/* メインレイアウト */}
      <div className="app-layout">
        <ParamPanel
          gameRule={gameRule} setGameRule={setGameRule}
          onGameRuleChange={() => setCameraZ(0)}
          flightShape={flightShape} setFlightShape={setFlightShape}
          shaftLength={shaftLength} setShaftLength={setShaftLength}
          barrelLength={barrelLength} setBarrelLength={setBarrelLength}
          weight={weight} setWeight={setWeight}
          cgMm={cgMm} setCgMm={setCgMm}
          speed={speed} setSpeed={setSpeed}
          angle={angle} setAngle={setAngle}
          releaseHeight={releaseHeight} setReleaseHeight={setReleaseHeight}
          releaseDistance={releaseDistance} setReleaseDistance={setReleaseDistance}
          gripMm={gripMm} setGripMm={setGripMm}
          initialPitch={initialPitch} setInitialPitch={setInitialPitch}
          onShowSettingInfo={() => setShowSettingInfo(true)}
          onShowThrowInfo={() => setShowThrowInfo(true)}
          onThrow={runSimulation} isLoading={isLoading}
          isDark={isDark} C={C} t={t}
        />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ border: `1px solid ${C.panelBorder}`, borderRadius: "8px", overflow: "hidden", background: C.panelBg }}>
            <div style={{ position: "relative" }}>
              <Scene3D
                trajectories={history
                  .filter(r => isSelected(r.id) && r.gameRule === gameRule)
                  .map((r) => ({
                    id: r.id,
                    points: JSON.parse(r.trajectoryJson),
                    color: COLORS[r.id % COLORS.length],
                    xOffset: (BOARD_X_MAP[r.gameRule] ?? 2.44) - (r.releaseDistance ?? 2.1),
                    instantDisplay: !animatingIds.has(r.id),
                    onComplete: handleDartComplete,
                    barrelLength: r.barrelLength ?? 45,
                    shaftLength:  r.shaftLength  ?? 45,
                    cgRatio:      r.cgRatio      ?? 50,
                    flightShape:  (r.flightShape  ?? "STANDARD") as FlightShape,
                  }))}
                releaseDistance={releaseDistance / 100}
                releaseHeight={releaseHeight / 100}
                gameRule={gameRule} cameraZ={cameraZ} cameraY={cameraY}
                flightShape={flightShape} playbackSpeed={playbackSpeed}
                isPlaying={isPlaying} restartKey={restartKey}
                barrelLength={barrelLength} shaftLength={shaftLength}
                initialPitch={initialPitch} cgRatio={cgMm / barrelLength * 100} gripRatio={gripMm / barrelLength * 100}
                releaseColor={COLORS[(history.length > 0 ? history[0].id + 1 : 0) % COLORS.length]}
                canvasBg={isDark ? "#1a1a2e" : "#c8d4ee"}
                surfaceColor={isDark ? "#373737" : "#f8faff"}
                isDark={isDark}
                onHorizontalScroll={(dx) => {
                  const half = (BOARD_X_MAP[gameRule] ?? 2.44) / 2;
                  setCameraZ(prev => Math.max(-half, Math.min(half, prev + dx * -0.003)));
                }}
                onVerticalScroll={(dy) => {
                  setCameraY(prev => Math.max(-2.0, Math.min(2.0, prev + dy * 0.003)));
                }}
                onResetCamera={() => { setCameraZ(0); setCameraY(0); }}
              />

              {/* 縦スライダー（視点高さ）- デスクトップのみ */}
              {!isMobile && (
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "56px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "12px", paddingBottom: "56px", overflow: "hidden" }}>
                  <span style={{ color: C.canvasText, fontSize: "13px", flexShrink: 0 }}>{t('cameraHeight')}</span>
                  <span style={{ color: C.canvasText, fontSize: "13px", marginBottom: "16px", flexShrink: 0 }}>{Math.round((1.7 + cameraY) * 100)}cm</span>
                  <div style={{ flex: 1, position: "relative" }}>
                    <input type="range" min="-2.0" max="2.0" step="0.01" value={cameraY}
                      onChange={(e) => setCameraY(Number(e.target.value))}
                      className="camera-slider-v"
                      style={{ position: "absolute", height: "100%", left: "50%", top: 0, transform: "translateX(-50%)", writingMode: "vertical-lr" as any, direction: "rtl" }}
                    />
                  </div>
                </div>
              )}

              {/* 横スライダー（視点左右）- デスクトップのみ */}
              {!isMobile && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 40, height: "56px", padding: "0 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", color: C.canvasText, fontSize: "13px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "48px", flexShrink: 0 }}>
                      <span style={{ whiteSpace: "nowrap" }}>{t('cameraLR')}</span>
                      <span style={{ whiteSpace: "nowrap", color: C.canvasText }}>{Math.round((BOARD_X_MAP[gameRule] / 2 + cameraZ) * 100)}cm</span>
                    </div>
                    <input type="range" min={-(BOARD_X_MAP[gameRule] / 2)} max={BOARD_X_MAP[gameRule] / 2} step="0.01" value={cameraZ}
                      onChange={(e) => setCameraZ(Number(e.target.value))}
                      style={{ flex: 1, writingMode: "horizontal-tb" as any, direction: "ltr" }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* カメラスライダー - モバイルのみ（Canvas下部） */}
            {isMobile && (
              <div style={{ borderTop: `1px solid ${C.panelBorder}`, background: C.panelBg }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", color: C.canvasText, fontSize: "13px", padding: "8px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "60px", flexShrink: 0 }}>
                    <span style={{ whiteSpace: "nowrap" }}>{t('cameraHeight')}</span>
                    <span style={{ whiteSpace: "nowrap" }}>{Math.round((1.7 + cameraY) * 100)}cm</span>
                  </div>
                  <input type="range" min="-2.0" max="2.0" step="0.01" value={cameraY}
                    onChange={(e) => setCameraY(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", color: C.canvasText, fontSize: "13px", padding: "0 16px 8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "60px", flexShrink: 0 }}>
                    <span style={{ whiteSpace: "nowrap" }}>{t('cameraLR')}</span>
                    <span style={{ whiteSpace: "nowrap" }}>{Math.round((BOARD_X_MAP[gameRule] / 2 + cameraZ) * 100)}cm</span>
                  </div>
                  <input type="range" min={-(BOARD_X_MAP[gameRule] / 2)} max={BOARD_X_MAP[gameRule] / 2} step="0.01" value={cameraZ}
                    onChange={(e) => setCameraZ(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                </label>
              </div>
            )}

            <PlaybackControls
              isPlaying={isPlaying} playbackSpeed={playbackSpeed}
              filteredHistory={filteredHistory} deselectedIds={deselectedIds}
              pendingCount={pendingCountRef.current}
              onPlayPause={() => setIsPlaying(v => !v)}
              onRestart={(ids) => {
                pendingCountRef.current = ids.length;
                setAnimatingIds(new Set(ids));
                setRestartKey(k => k + 1);
                setIsPlaying(true);
              }}
              onSpeedChange={setPlaybackSpeed}
              C={C} t={t}
            />
          </div>
        </div>
      </div>

      <HistoryTable
        history={history} gameRule={gameRule}
        deselectedIds={deselectedIds}
        page={page} setPage={setPage}
        onToggleSelect={toggleSelect}
        onDeleteRecord={deleteRecord}
        onDeleteAll={() => setShowDeleteConfirm(true)}
        onShowAll={() => {
          setDeselectedIds(prev => { const s = new Set(prev); filteredHistory.forEach(r => s.delete(r.id)); return s; });
          setAnimatingIds(prev => { const s = new Set(prev); filteredHistory.forEach(r => s.delete(r.id)); return s; });
        }}
        onHideAll={() => setDeselectedIds(prev => { const s = new Set(prev); filteredHistory.forEach(r => s.add(r.id)); return s; })}
        onShowHistoryInfo={(pos) => { setHistoryInfoButtonPos(pos); setShowHistoryInfo(v => !v); }}
        C={C} t={t}
      />

      {/* モーダル群 */}
      {showThrowInfo   && <ThrowInfoModal   onClose={() => setShowThrowInfo(false)}   C={C} t={t} />}
      {showSettingInfo && <SettingInfoModal onClose={() => setShowSettingInfo(false)} C={C} t={t} />}
      {showHistoryInfo && historyInfoButtonPos && <HistoryInfoPopup position={historyInfoButtonPos} onClose={() => setShowHistoryInfo(false)} C={C} t={t} />}
      {showDeleteConfirm && <DeleteConfirmModal onConfirm={deleteHistory} onCancel={() => setShowDeleteConfirm(false)} isDeleting={isDeleting} C={C} t={t} />}
    </div>
  );
}
