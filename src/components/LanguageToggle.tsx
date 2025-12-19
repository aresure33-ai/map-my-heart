import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    >
      {t('language')}
    </Button>
  );
};
