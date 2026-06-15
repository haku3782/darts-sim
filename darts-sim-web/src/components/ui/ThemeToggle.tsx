import type { ThemeColors } from "../../hooks/useTheme";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  C: ThemeColors;
}

/** ライト/ダークモード切替ボタン */
export default function ThemeToggle({ isDark, onToggle, C }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"}
      style={{
        width: "36px", height: "36px",
        borderRadius: "50%",
        border: `1px solid ${C.panelBorder}`,
        background: C.panelBg,
        color: C.textAccent,
        fontSize: "18px",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {isDark ? "☀" : (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 6 6 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
