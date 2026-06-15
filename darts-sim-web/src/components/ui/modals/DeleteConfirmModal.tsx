import type { ThemeColors } from "../../../hooks/useTheme";
import type { TFunc } from "../../../i18n/translations";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  C: ThemeColors;
  t: TFunc;
}

export default function DeleteConfirmModal({ onConfirm, onCancel, isDeleting, C, t }: DeleteConfirmModalProps) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.modalBg, border: `1px solid ${C.modalBorder2}`, borderRadius: "10px", padding: "28px 32px", minWidth: "280px", width: "90%", maxWidth: "360px", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
        <p style={{ margin: "0 0 24px", fontSize: "15px", color: C.text, lineHeight: 1.6 }}>{t('deleteConfirmMsg')}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button onClick={onCancel} style={{ width: "100px", padding: "7px 0", fontSize: "14px", background: C.cancelBg, color: C.cancelText, border: `1px solid ${C.cancelBorder}`, borderRadius: "6px", cursor: "pointer" }}>
            {t('cancel')}
          </button>
          <button onClick={onConfirm} disabled={isDeleting} style={{ width: "100px", padding: "7px 0", fontSize: "14px", background: isDeleting ? "#3a1a1a" : "#5a1a1a", color: isDeleting ? "#885555" : "#ffaaaa", border: "1px solid #7a2a2a", borderRadius: "6px", cursor: isDeleting ? "default" : "pointer" }}>
            {isDeleting ? t('deleting') : t('deleteBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
