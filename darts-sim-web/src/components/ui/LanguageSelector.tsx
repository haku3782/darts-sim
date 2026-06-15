import type { ThemeColors } from "../../hooks/useTheme";
import type { LangCode } from "../../i18n/translations";
import type { LangOption } from "../../hooks/useLanguage";

interface LanguageSelectorProps {
  lang: LangCode;
  langList: LangOption[];
  onChange: (code: LangCode) => void;
  C: ThemeColors;
}

export default function LanguageSelector({ lang, langList, onChange, C }: LanguageSelectorProps) {
  return (
    <select
      value={lang}
      onChange={e => onChange(e.target.value as LangCode)}
      style={{
        background: C.panelBg,
        color: C.text,
        border: `1px solid ${C.panelBorder}`,
        borderRadius: "6px",
        padding: "4px 8px",
        fontSize: "13px",
        cursor: "pointer",
      }}
    >
      {langList.map(({ code, name, flag }) => (
        <option key={code} value={code}>{flag} {name}</option>
      ))}
    </select>
  );
}
