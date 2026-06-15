import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  // テーマカラー
  const C = {
    pageBg:          isDark ? "#0f0f1a" : "#eef0f8",
    panelBg:         isDark ? "#1a1a2e" : "#ffffff",
    panelBorder:     isDark ? "#2e2e4e" : "#d0d4e8",
    cardBg:          isDark ? "#12122a" : "#f5f7ff",
    text:            isDark ? "#e0e0e0" : "#1e2040",
    textMuted:       isDark ? "#c0c8e0" : "#4a5080",
    textAccent:      isDark ? "#a0a8c0" : "#5060a0",
    textTitle:       isDark ? "#b0bcd0" : "#5060a0",
    textDim:         isDark ? "#50587a" : "#8890b8",
    canvasText:      isDark ? "#a0a8c0" : "#1a4a8a",
    sectionBorder:   isDark ? "#2e2e4e" : "#d0d4e8",
    infoBtn:         isDark ? "#2a2a4a" : "#e4e8f8",
    infoBtnBorder:   isDark ? "#4a4a6a" : "#b0b8d8",
    modalBg:         isDark ? "#1a1a2e" : "#ffffff",
    modalBorder:     isDark ? "#4a4a6a" : "#c0c8e8",
    modalBorder2:    isDark ? "#3a3a5e" : "#d0d4e8",
    modalText:       isDark ? "#c0c8e0" : "#4a5080",
    modalTitle:      isDark ? "#e0e0f0" : "#1e2040",
    closeBg:         isDark ? "#2e3a5a" : "#dde4f8",
    closeBorder:     isDark ? "#3a4a6a" : "#b0bcd8",
    closeText:       isDark ? "#aaccff" : "#1a4a8a",
    cancelBg:        isDark ? "#2a2a3e" : "#f0f2ff",
    cancelBorder:    isDark ? "#3a3a5e" : "#c0c8e8",
    cancelText:      isDark ? "#a0a8c0" : "#5060a0",
    btnBg:           isDark ? "#1a3a5a" : "#e8f0ff",
    btnBorder:       isDark ? "#3a6a9a" : "#90b8d8",
    btnText:         isDark ? "#aaddff" : "#1a4a8a",
    btnDisBg:        isDark ? "#121228" : "#eef0f8",
    btnDisBorder:    isDark ? "#2e2e4e" : "#d0d4e8",
    btnDisText:      isDark ? "#555577" : "#a0a8c0",
    playBg:          isDark ? "#1a2a3a" : "#e8f0ff",
    playBorder:      isDark ? "#2e4e6e" : "#90b0d8",
    playText:        isDark ? "#aaddff" : "#1a4a8a",
    playDisBg:       isDark ? "#131e2a" : "#f0f4ff",
    playDisBorder:   isDark ? "#1e2e3e" : "#d0d8f0",
    playDisText:     isDark ? "#2a3a4a" : "#c0c8e0",
    tableHeaderBg:   isDark ? "#0d0d20" : "#eaecf8",
    tableHeaderText: isDark ? "#50587a" : "#7080a8",
    tableRowBg:      isDark ? "#1a1a2e" : "#ffffff",
    tableRowSel:     isDark ? "#1c2240" : "#eef2ff",
    tableRowHov:     isDark ? "#1e2040" : "#f4f6ff",
    tableRowBorder:  isDark ? "#1e1e38" : "#e8eaf8",
    tableText:       isDark ? "#c8cfe0" : "#3a4060",
    rowToggleBg:     isDark ? "#1e1e2e" : "#f0f4ff",
    rowToggleBorder: isDark ? "#2a2a4a" : "#c8d0e8",
    rowToggleOff:    isDark ? "#404060" : "#9090b0",
    speedBg:         isDark ? "#121228" : "#f0f2ff",
    speedBorder:     isDark ? "#2e2e4e" : "#c8d0e8",
    speedText:       isDark ? "#a0a8c0" : "#5060a0",
    paginBg:         isDark ? "#2e2e4e" : "#e8eaf8",
    paginText:       isDark ? "#aaccff" : "#1a4a8a",
    deleteBg:        isDark ? "transparent" : "transparent",
    deleteBorder:    isDark ? "#6a3a3a" : "#d08080",
    deleteText:      isDark ? "#cc6666"  : "#aa3333",
  };

  useEffect(() => {
    document.body.style.background = C.pageBg;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, setIsDark, C };
}

/** 各UIコンポーネントの props で C の型として使用 */
export type ThemeColors = ReturnType<typeof useTheme>["C"];
