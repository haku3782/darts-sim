import type { ThemeColors } from "../../../hooks/useTheme";
import type { TFunc } from "../../../i18n/translations";

interface SettingInfoModalProps {
  onClose: () => void;
  C: ThemeColors;
  t: TFunc;
}

export default function SettingInfoModal({ onClose, C, t }: SettingInfoModalProps) {
  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.modalBg, border: `1px solid ${C.modalBorder}`, borderRadius: "8px", padding: "20px 24px", maxWidth: "360px", width: "90%", fontSize: "13px", color: C.modalText, lineHeight: "1.8", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
        <p style={{ margin: "0 0 8px", fontWeight: "bold", color: C.modalTitle, fontSize: "14px" }}>{t('settingInfoTitle')}</p>
        <ul style={{ margin: 0, paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <li><strong style={{ color: C.modalTitle }}>{t('settingInfoFlight')}</strong>：{t('settingInfoFlightDesc')}</li>
          <li><strong style={{ color: C.modalTitle }}>{t('settingInfoShaft')}</strong>：{t('settingInfoShaftDesc')}</li>
          <li><strong style={{ color: C.modalTitle }}>{t('settingInfoBarrel')}</strong>：{t('settingInfoBarrelDesc')}</li>
          <li><strong style={{ color: C.modalTitle }}>{t('settingInfoWeight')}</strong>：{t('settingInfoWeightDesc')}</li>
          <li><strong style={{ color: C.modalTitle }}>{t('settingInfoCg')}</strong>：{t('settingInfoCgDesc')}</li>
        </ul>
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: `1px solid ${C.modalBorder2}`, fontSize: "12px", color: C.textDim, lineHeight: "1.8" }}>
          <strong style={{ color: C.textAccent }}>{t('settingInfoNoteTitle')}</strong><br />
          {t('settingInfoNoteDesc')}
        </div>
        <button onClick={onClose} style={{ marginTop: "14px", padding: "4px 16px", fontSize: "12px", background: C.closeBg, color: C.closeText, border: `1px solid ${C.closeBorder}`, borderRadius: "4px", cursor: "pointer", display: "block", marginLeft: "auto" }}>
          {t('close')}
        </button>
      </div>
    </div>
  );
}
