import React, { useRef } from "react";

interface NumInputProps {
  step: number;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  isDark?: boolean;
}

/** ＋/－ボタン付き数値入力（長押し連続変化対応） */
const NumInput = React.memo(({ step, value, onChange, min, max, isDark = true }: NumInputProps) => {
  const timerRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef    = useRef(value);
  valueRef.current  = value;

  const decimals = step.toString().includes(".")
    ? step.toString().split(".")[1].length : 0;

  const doAdjust = (delta: number) => {
    const next = parseFloat((valueRef.current + delta).toFixed(decimals));
    if (min !== undefined && next < min) return;
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  const startPress = (delta: number) => {
    doAdjust(delta);
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => doAdjust(delta), 80);
    }, 400);
  };

  const stopPress = () => {
    if (timerRef.current)    { clearTimeout(timerRef.current);   timerRef.current    = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const btnStyle: React.CSSProperties = {
    width: "28px", height: "28px", flexShrink: 0,
    background: isDark ? "#1a3a5a" : "#e8f0ff",
    color: isDark ? "#aaddff" : "#1a4a8a",
    border: `1px solid ${isDark ? "#3a6a9a" : "#90b8d8"}`,
    borderRadius: "5px",
    fontSize: "16px", lineHeight: "1", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    userSelect: "none",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", width: "100%" }}>
      <button type="button"
        onMouseDown={() => startPress(-step)} onMouseUp={stopPress} onMouseLeave={stopPress}
        onTouchStart={(e) => { e.preventDefault(); startPress(-step); }} onTouchEnd={stopPress} onTouchCancel={stopPress}
        style={btnStyle}
      >−</button>
      <input
        type="number" step={step}
        {...(min !== undefined ? { min } : {})}
        {...(max !== undefined ? { max } : {})}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, minWidth: 0, boxSizing: "border-box", textAlign: "center" }}
      />
      <button type="button"
        onMouseDown={() => startPress(+step)} onMouseUp={stopPress} onMouseLeave={stopPress}
        onTouchStart={(e) => { e.preventDefault(); startPress(+step); }} onTouchEnd={stopPress} onTouchCancel={stopPress}
        style={btnStyle}
      >＋</button>
    </div>
  );
});

export default NumInput;
