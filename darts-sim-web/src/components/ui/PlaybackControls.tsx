import type { ThemeColors } from "../../hooks/useTheme";
import type { SimulationRecord } from "../../types/simulation";
import type { TFunc } from "../../i18n/translations";

interface PlaybackControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  filteredHistory: SimulationRecord[];
  deselectedIds: Set<number>;
  pendingCount: number;
  onPlayPause: () => void;
  onRestart: (ids: number[]) => void;
  onSpeedChange: (speed: number) => void;
  C: ThemeColors;
  t: TFunc;
}

export default function PlaybackControls({
  isPlaying, playbackSpeed,
  filteredHistory, deselectedIds,
  pendingCount,
  onPlayPause, onRestart, onSpeedChange,
  C, t,
}: PlaybackControlsProps) {
  const isSelected = (id: number) => !deselectedIds.has(id);
  const hasVisible = filteredHistory.some(r => isSelected(r.id));

  const handleClick = () => {
    if (isPlaying) {
      onPlayPause();
    } else if (pendingCount > 0) {
      onPlayPause();
    } else {
      const visibleIds = filteredHistory.filter(r => isSelected(r.id)).map(r => r.id);
      if (visibleIds.length > 0) onRestart(visibleIds);
    }
  };

  return (
    <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.panelBorder}`, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", background: C.panelBg }}>
      <button
        disabled={!hasVisible && !isPlaying}
        onClick={handleClick}
        style={{ width: "44px", height: "36px", padding: "0", fontSize: "18px", lineHeight: "36px", textAlign: "center", borderRadius: "6px", background: (!hasVisible && !isPlaying) ? C.playDisBg : C.playBg, border: `1px solid ${(!hasVisible && !isPlaying) ? C.playDisBorder : C.playBorder}`, color: (!hasVisible && !isPlaying) ? C.playDisText : C.playText, cursor: (!hasVisible && !isPlaying) ? "default" : "pointer" }}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>
      <span style={{ color: C.textAccent, fontSize: "13px", marginLeft: "4px" }}>{t('speed')}</span>
      {([0.02, 0.1, 1.0] as const).map(s => (
        <button key={s} onClick={() => onSpeedChange(s)} style={{ padding: "4px 10px", fontSize: "13px", background: playbackSpeed === s ? C.btnBg : C.speedBg, border: `1px solid ${playbackSpeed === s ? C.btnBorder : C.speedBorder}`, borderRadius: "6px", color: playbackSpeed === s ? C.btnText : C.speedText, cursor: "pointer", fontWeight: playbackSpeed === s ? "bold" : "normal" }}>
          {s === 1.0 ? "1x" : `${s}x`}
        </button>
      ))}
    </div>
  );
}
