import { useLanguage } from "@/context/LanguageContext";

const SUBJECT_HI: Record<string, string> = {
  mathematics: "गणित",
  maths: "गणित",
  math: "गणित",
  physics: "भौतिकी",
  chemistry: "रसायन विज्ञान",
  biology: "जीव विज्ञान",
  "computer science": "कंप्यूटर विज्ञान",
  cs: "कंप्यूटर विज्ञान",
  sst: "सामाजिक विज्ञान",
  "social studies": "सामाजिक विज्ञान",
  "social science": "सामाजिक विज्ञान",
  sanskrit: "संस्कृत",
  hindi: "हिंदी",
  english: "अंग्रेज़ी",
  history: "इतिहास",
  geography: "भूगोल",
  economics: "अर्थशास्त्र",
  science: "विज्ञान",
  literature: "साहित्य",
  art: "कला",
  music: "संगीत",
  health: "स्वास्थ्य विज्ञान",
  environment: "पर्यावरण विज्ञान",
  civics: "नागरिक शास्त्र",
  dld: "DLD",
  hld: "HLD",
};

const DIFFICULTY_HI: Record<string, string> = {
  easy: "आसान",
  medium: "मध्यम",
  hard: "कठिन",
};

export function useLocalizeContent() {
  const { language } = useLanguage();

  function localizeSubject(name: string): string {
    if (language === "en") return name;
    return SUBJECT_HI[name.trim().toLowerCase()] ?? name;
  }

  function localizeDifficulty(diff: string): string {
    if (language === "en") return diff;
    return DIFFICULTY_HI[diff.trim().toLowerCase()] ?? diff;
  }

  return { localizeSubject, localizeDifficulty };
}
