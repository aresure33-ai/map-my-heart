import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ur';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

const translations: Translations = {
  // Landing page
  welcome: {
    en: "Welcome!",
    ur: "خوش آمدید!"
  },
  heroTitle: {
    en: "Discover Your Love Connection",
    ur: "اپنا محبت کا رشتہ دریافت کریں"
  },
  heroSubtitle: {
    en: "Enter your names, pick your locations on the map, and let destiny reveal your compatibility",
    ur: "اپنے نام درج کریں، نقشے پر اپنے مقامات منتخب کریں، اور تقدیر کو اپنی مطابقت ظاہر کرنے دیں"
  },
  startTest: {
    en: "Start Love Test",
    ur: "محبت کا ٹیسٹ شروع کریں"
  },
  howItWorks: {
    en: "How It Works",
    ur: "یہ کیسے کام کرتا ہے"
  },
  step1Title: {
    en: "Enter Names",
    ur: "نام درج کریں"
  },
  step1Desc: {
    en: "Type in both names to begin your love journey",
    ur: "اپنا محبت کا سفر شروع کرنے کے لیے دونوں نام ٹائپ کریں"
  },
  step2Title: {
    en: "Pick Locations",
    ur: "مقامات منتخب کریں"
  },
  step2Desc: {
    en: "Click on the map to mark your special places",
    ur: "اپنی خاص جگہیں نشان زد کرنے کے لیے نقشے پر کلک کریں"
  },
  step3Title: {
    en: "Get Results",
    ur: "نتائج حاصل کریں"
  },
  step3Desc: {
    en: "Discover your magical love compatibility score",
    ur: "اپنا جادوئی محبت کی مطابقت کا اسکور دریافت کریں"
  },

  // Test page
  yourName: {
    en: "Your Name",
    ur: "آپ کا نام"
  },
  partnerName: {
    en: "Partner's Name",
    ur: "پارٹنر کا نام"
  },
  enterName: {
    en: "Enter name...",
    ur: "نام درج کریں..."
  },
  selectLocations: {
    en: "Select Locations on Map",
    ur: "نقشے پر مقامات منتخب کریں"
  },
  clickToPlace: {
    en: "Click on the map to place pins for both of you",
    ur: "دونوں کے لیے پن لگانے کے لیے نقشے پر کلک کریں"
  },
  yourLocation: {
    en: "Your Location",
    ur: "آپ کا مقام"
  },
  partnerLocation: {
    en: "Partner's Location",
    ur: "پارٹنر کا مقام"
  },
  selected: {
    en: "Selected",
    ur: "منتخب"
  },
  notSelected: {
    en: "Click map to select",
    ur: "منتخب کرنے کے لیے نقشے پر کلک کریں"
  },
  calculateLove: {
    en: "Calculate Love Score",
    ur: "محبت کا اسکور شمار کریں"
  },
  fillAllFields: {
    en: "Please fill in both names and select both locations",
    ur: "براہ کرم دونوں نام اور دونوں مقامات منتخب کریں"
  },

  // Result page
  loveScore: {
    en: "Love Score",
    ur: "محبت کا اسکور"
  },
  compatibility: {
    en: "Compatibility",
    ur: "مطابقت"
  },
  distance: {
    en: "Distance Between You",
    ur: "آپ کے درمیان فاصلہ"
  },
  km: {
    en: "km",
    ur: "کلومیٹر"
  },
  shareResult: {
    en: "Share Result",
    ur: "نتیجہ شیئر کریں"
  },
  tryAgain: {
    en: "Try Again",
    ur: "دوبارہ کوشش کریں"
  },
  copied: {
    en: "Link copied to clipboard!",
    ur: "لنک کاپی ہو گیا!"
  },

  // Love messages
  soulmates: {
    en: "Soulmates Forever! 💕",
    ur: "ہمیشہ کے لیے روح کے ساتھی! 💕"
  },
  perfectMatch: {
    en: "A Perfect Match Made in Heaven! ✨",
    ur: "جنت میں بنی کامل جوڑی! ✨"
  },
  strongBond: {
    en: "A Strong Bond of Love! 💖",
    ur: "محبت کا مضبوط رشتہ! 💖"
  },
  goodConnection: {
    en: "A Beautiful Connection! 🌹",
    ur: "ایک خوبصورت رشتہ! 🌹"
  },
  growingLove: {
    en: "Love is Growing! 🌱",
    ur: "محبت بڑھ رہی ہے! 🌱"
  },
  newBeginning: {
    en: "A New Beginning! 💫",
    ur: "ایک نئی شروعات! 💫"
  },

  // Navigation
  backToHome: {
    en: "Back to Home",
    ur: "گھر واپس"
  },
  language: {
    en: "اردو",
    ur: "English"
  }
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
