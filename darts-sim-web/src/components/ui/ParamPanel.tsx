import React from "react";
import type { GameRule, FlightShape } from "../../types/simulation";
import type { ThemeColors } from "../../hooks/useTheme";
import type { TFunc } from "../../i18n/translations";
import NumInput from "./NumInput";

interface ParamPanelProps {
  gameRule: GameRule; setGameRule: (r: GameRule) => void;
  onGameRuleChange?: () => void;
  flightShape: FlightShape; setFlightShape: (s: FlightShape) => void;
  shaftLength: number; setShaftLength: (v: number) => void;
  barrelLength: number; setBarrelLength: (v: number) => void;
  weight: number; setWeight: (v: number) => void;
  cgMm: number; setCgMm: (v: number) => void;
  speed: number; setSpeed: (v: number) => void;
  angle: number; setAngle: (v: number) => void;
  releaseHeight: number; setReleaseHeight: (v: number) => void;
  releaseDistance: number; setReleaseDistance: (v: number) => void;
  gripMm: number; setGripMm: (v: number) => void;
  initialPitch: number; setInitialPitch: (v: number) => void;
  onShowSettingInfo: () => void;
  onShowThrowInfo: () => void;
  onThrow: () => void;
  isLoading: boolean;
  isDark: boolean;
  C: ThemeColors;
  t: TFunc;
}

export default function ParamPanel({
  gameRule, setGameRule, onGameRuleChange,
  flightShape, setFlightShape,
  shaftLength, setShaftLength,
  barrelLength, setBarrelLength,
  weight, setWeight,
  cgMm, setCgMm,
  speed, setSpeed,
  angle, setAngle,
  releaseHeight, setReleaseHeight,
  releaseDistance, setReleaseDistance,
  gripMm, setGripMm,
  initialPitch, setInitialPitch,
  onShowSettingInfo, onShowThrowInfo,
  onThrow, isLoading,
  isDark, C, t,
}: ParamPanelProps) {

  const sectionHeader: React.CSSProperties = {
    margin: "0 0 8px", paddingBottom: "4px",
    borderBottom: `1px solid ${C.sectionBorder}`,
    fontSize: "15px", fontWeight: "bold",
    color: C.textAccent, letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
  const fieldGrid: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const labelFontSize = t('labelFontSize');
  const field = (label: string, el: React.ReactNode): React.ReactNode => (
    <label key={label} className="param-field" style={{ fontSize: "14px" }}>
      <span className="param-field-label" style={{ color: C.textMuted, fontSize: labelFontSize }}>{label}</span>
      <div className="param-field-input">{el}</div>
    </label>
  );
  const numInput = (step: number, value: number, onChange: (v: number) => void, min?: number, max?: number) =>
    <NumInput step={step} value={value} onChange={onChange} min={min} max={max} isDark={isDark} />;
  const infoBtn = (onClick: () => void) => (
    <button onClick={onClick} style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1px solid ${C.infoBtnBorder}`, background: C.infoBtn, color: C.textAccent, fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>?</button>
  );

  return (
    <div className="param-panel" style={{ background: C.panelBg, borderRadius: "8px", border: `1px solid ${C.panelBorder}` }}>

      {/* ── ルール ── */}
      <div>
        <p style={sectionHeader}>{t('rule')}</p>
        <div style={fieldGrid}>
          <select value={gameRule} onChange={e => { setGameRule(e.target.value as GameRule); onGameRuleChange?.(); }} style={{ width: "100%", boxSizing: "border-box" }}>
            <option value="SOFT">{t('ruleSOFT')}</option>
            <option value="HARD">{t('ruleHARD')}</option>
          </select>
        </div>
      </div>

      {/* ── セッティング ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: `1px solid ${C.sectionBorder}`, paddingBottom: "4px", marginBottom: "8px" }}>
          <p style={{ ...sectionHeader, margin: 0, borderBottom: "none", paddingBottom: 0 }}>{t('settingSection')}</p>
          {infoBtn(onShowSettingInfo)}
        </div>
        <div style={fieldGrid}>
          {field(t('flightShapeLabel'),
            <select value={flightShape} onChange={e => setFlightShape(e.target.value as FlightShape)} style={{ width: "100%", boxSizing: "border-box" }}>
              <option value="STANDARD">{t('flightNameSTANDARD')}</option>
              <option value="SHAPE">{t('flightNameSHAPE')}</option>
              <option value="TEARDROP">{t('flightNameTEARDROP')}</option>
              <option value="KITE">{t('flightNameKITE')}</option>
              <option value="SLIM">{t('flightNameSLIM')}</option>
            </select>
          )}
          {field(t('shaftLength'),  numInput(1,   shaftLength,  setShaftLength, 0))}
          {field(t('barrelLength'), numInput(1,   barrelLength, setBarrelLength, 10, 80))}
          {field(t('totalWeight'),  numInput(0.1, weight,       setWeight, 0))}
          {field(t('cgRatio'),      numInput(1,   cgMm,         setCgMm, 0, barrelLength))}
        </div>
      </div>

      {/* ── スロー条件 ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", borderBottom: `1px solid ${C.sectionBorder}`, paddingBottom: "4px", marginBottom: "8px" }}>
          <p style={{ ...sectionHeader, margin: 0, borderBottom: "none", paddingBottom: 0 }}>{t('throwSection')}</p>
          {infoBtn(onShowThrowInfo)}
        </div>
        <div style={{ ...fieldGrid, marginTop: "8px" }}>
          {field(t('initialSpeed'),    numInput(0.1, speed,           setSpeed, 0))}
          {field(t('launchAngle'),     numInput(1,   angle,           setAngle))}
          {field(t('releaseHeight'),   numInput(1,   releaseHeight,   setReleaseHeight, 0))}
          {field(t('releaseDistance'), numInput(1,   releaseDistance, setReleaseDistance))}
          {field(t('gripRatio'), numInput(1, gripMm, setGripMm, 0, barrelLength + shaftLength))}
          {field(t('initialPitch'), numInput(1, initialPitch, setInitialPitch))}
        </div>
      </div>

      {/* ── 投げるボタン ── */}
      <button onClick={onThrow} disabled={isLoading} style={{ padding: "10px 20px", fontSize: "15px", fontWeight: "bold", background: isLoading ? C.playBg : C.btnBg, color: isLoading ? C.btnDisText : C.btnText, border: `1px solid ${isLoading ? C.btnDisBorder : C.btnBorder}`, borderRadius: "6px", cursor: isLoading ? "default" : "pointer", width: "100%", letterSpacing: "0.05em" }}>
        {isLoading ? t('calculating') : t('throwBtn')}
      </button>
    </div>
  );
}
