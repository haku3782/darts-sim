import type { ThemeColors } from "../../../hooks/useTheme";
import type { TFunc } from "../../../i18n/translations";

interface HistoryInfoPopupProps {
  position: { top: number; left: number };
  onClose: () => void;
  C: ThemeColors;
  t: TFunc;
}

export default function HistoryInfoPopup({ position, onClose, C, t }: HistoryInfoPopupProps) {
  const popupWidth = 300;
  const margin = 8;
  const safeLeft = Math.max(margin, Math.min(position.left, window.innerWidth - popupWidth - margin));
  const safeTop  = Math.max(margin, Math.min(position.top,  window.innerHeight - 120 - margin));

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: safeTop, left: safeLeft, background: C.modalBg, border: `1px solid ${C.modalBorder}`, borderRadius: "8px", padding: "16px 20px", maxWidth: `${popupWidth}px`, fontSize: "13px", color: C.modalText, lineHeight: "1.7", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
        <p style={{ margin: 0 }}>{t('historyInfoMsg')}</p>
        <button onClick={onClose} style={{ marginTop: "12px", padding: "4px 16px", fontSize: "12px", background: C.closeBg, color: C.closeText, border: `1px solid ${C.closeBorder}`, borderRadius: "4px", cursor: "pointer", display: "block", marginLeft: "auto" }}>
          {t('close')}
        </button>
      </div>
    </div>
  );
}
