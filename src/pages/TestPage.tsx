import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoveTest } from '@/contexts/LoveTestContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HeartIcon } from '@/components/HeartIcon';
import { LazyLoveMap } from '@/components/LazyLoveMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Check, Heart } from 'lucide-react';

const TestPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data, setName1, setName2, setLocation1, setLocation2, calculateScore } = useLoveTest();
  const isUrdu = language === 'ur';

  const handleCalculate = () => {
    if (!data.name1.trim() || !data.name2.trim() || !data.location1 || !data.location2) {
      toast.error(t('fillAllFields'));
      return;
    }
    calculateScore();
    navigate('/result');
  };

  const isReady = data.name1.trim() && data.name2.trim() && data.location1 && data.location2;

  return (
    <div className={`min-h-screen gradient-soft ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <HeartIcon className="w-8 h-8 animate-heartbeat" />
            <span className="font-display text-xl font-semibold">Love Test</span>
          </Link>
          <LanguageToggle />
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>

          {/* Name Inputs */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8 mb-8 animate-fade-up">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name1" className="text-foreground font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  {t('yourName')}
                </Label>
                <Input
                  id="name1"
                  placeholder={t('enterName')}
                  value={data.name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name2" className="text-foreground font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-coral" />
                  {t('partnerName')}
                </Label>
                <Input
                  id="name2"
                  placeholder={t('enterName')}
                  value={data.name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-2xl font-semibold mb-2 text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              {t('selectLocations')}
            </h2>
            <p className="text-muted-foreground mb-6">{t('clickToPlace')}</p>

            <LazyLoveMap
              location1={data.location1}
              location2={data.location2}
              name1={data.name1}
              name2={data.name2}
              onLocation1Set={setLocation1}
              onLocation2Set={setLocation2}
            />

            {/* Location Status */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                data.location1 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-muted/30'
              }`}>
                <div className="flex items-center gap-3">
                  {data.location1 ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{t('yourLocation')}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.location1 ? t('selected') : t('notSelected')}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                data.location2 
                  ? 'border-coral bg-coral/5' 
                  : 'border-border bg-muted/30'
              }`}>
                <div className="flex items-center gap-3">
                  {data.location2 ? (
                    <Check className="w-5 h-5 text-coral" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{t('partnerLocation')}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.location2 ? t('selected') : t('notSelected')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Button
              size="lg"
              onClick={handleCalculate}
              disabled={!isReady}
              className={`gradient-hero text-primary-foreground px-12 py-6 text-lg font-semibold rounded-full transition-all duration-300 ${
                isReady 
                  ? 'shadow-glow hover:shadow-soft hover:scale-105 animate-pulse-glow' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <HeartIcon className="w-6 h-6 mr-2" />
              {t('calculateLove')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
