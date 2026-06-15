import { useState, useCallback } from 'react';
import { translations, type LangCode, type Translation, type TFunc } from '../i18n/translations';

const STORAGE_KEY = 'darts-sim-lang';

function detectLang(): LangCode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in translations) return saved as LangCode;
  const b = navigator.language.toLowerCase();
  if (b.startsWith('zh-tw') || b.startsWith('zh-hk')) return 'zh-TW';
  if (b.startsWith('zh')) return 'zh';
  if (b.startsWith('ko')) return 'ko';
  if (b.startsWith('th')) return 'th';
  if (b.startsWith('ja')) return 'ja';
  return 'en';
}

export interface LangOption { code: LangCode; name: string; flag: string; }

export function useLanguage() {
  const [lang, setLang] = useState<LangCode>(detectLang);

  const changeLang = useCallback((code: LangCode) => {
    setLang(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t: TFunc = useCallback((key: keyof Translation): string => {
    return (translations[lang][key] ?? translations['en'][key] ?? String(key)) as string;
  }, [lang]);

  const langList: LangOption[] = Object.entries(translations).map(([code, tr]) => ({
    code: code as LangCode,
    name: tr.langName,
    flag: tr.flag,
  }));

  return { lang, changeLang, t, langList };
}
