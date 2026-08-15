import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हिं', name: 'हिन्दी' },
  { code: 'te', label: 'తె', name: 'తెలుగు' },
];

export const labels = {
  appName: { en: 'AgriSaathi', hi: 'अग्रीसाथी', te: 'అగ్రిసాథీ' },
  home: { en: 'Home', hi: 'होम', te: 'హోమ్' },
  diagnose: { en: 'Diagnose', hi: 'निदान', te: 'రోగ నిర్ధారణ' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', te: 'డాష్బోర్డ్' },
  nearMe: { en: 'Near Me', hi: 'आस-पास', te: 'నా దగ్గర' },
  crops: { en: 'Crops', hi: 'फसलें', te: 'పంటలు' },
  livestock: { en: 'Livestock', hi: 'पशुधन', te: 'పశువులు' },
  irrigation: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటిపారుదల' },
  harvest: { en: 'Harvest', hi: 'कटाई', te: 'పంటకోత' },
  loan: { en: 'Loan', hi: 'ऋण', te: 'రుణ' },
  weather: { en: 'Weather', hi: 'मौसम', te: 'వాతావరణం' },
  marketplace: { en: 'Marketplace', hi: 'बाज़ार', te: 'మార్కెట్' },
  training: { en: 'Training', hi: 'प्रशिक्षण', te: 'శిక్షణ' },
  voice: { en: 'Voice Notes', hi: 'वॉइस नोट्स', te: 'వాయిస్ నోట్స్' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  community: { en: 'Community', hi: 'समुदाय', te: 'కమ్యూనిటీ' },
  schemes: { en: 'Schemes', hi: 'योजनाएँ', te: 'పథకాలు' },
  fertilizer: { en: 'Fertilizer', hi: 'उर्वरक', te: 'ఎరువు' },
  soil: { en: 'Soil Passport', hi: 'मिट्टी पासपोर्ट', te: 'నేల పాస్పోర్ట్' },
  planner: { en: 'Crop Planner', hi: 'फसल योजना', te: 'పంట ప్రణాళిక' },
  ledger: { en: 'Farm Ledger', hi: 'खेत बही', te: 'పొలం ఖాతా' },
  save: { en: 'Save', hi: 'सहेजें', te: 'సేవ్' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', te: 'రద్దు' },
  delete: { en: 'Delete', hi: 'हटाएं', te: 'తొలగించు' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा...', te: 'లోడ్ అవుతోంది...' },
  noData: { en: 'No data available', hi: 'कोई डेटा नहीं', te: 'డేటా అందుబాటులో లేదు' },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('agri_lang') || 'en');
  useEffect(() => { localStorage.setItem('agri_lang', lang); }, [lang]);
  const t = (key) => (labels[key] ? (labels[key][lang] || labels[key].en) : key);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return context;
};
