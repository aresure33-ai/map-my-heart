import React from 'react';
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
import { ArrowLeft, MapPin, Check, Heart, Sparkles, ArrowRight } from 'lucide-react';

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
  const completedSteps = [data.name1.trim(), data.name2.trim(), data.location1, data.location2].filter(Boolean).length;
  const progress = (completedSteps / 4) * 100;

  return (
    <div className={`min-h-screen mesh-bg relative ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <HeartIcon className="w-8 h-8 text-primary animate-heartbeat" />
            <span className="font-display text-2xl font-medium tracking-tight">
              love<span className="text-gradient italic">mapped</span>
            </span>
          </Link>
          <LanguageToggle />
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-border/30 relative overflow-hidden">
          <div
            className="h-full gradient-hero transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      <main className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-accent text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t('backToHome')}
          </Link>

          {/* Header */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase text-foreground/80 font-accent">
                {language === 'en' ? 'Step into love' : 'محبت میں قدم رکھیں'}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-normal text-foreground">
              {language === 'en' ? (
                <>Tell us your <span className="italic text-gradient">story</span></>
              ) : (
                <>اپنی <span className="italic text-gradient">کہانی</span> بتائیں</>
              )}
            </h1>
          </div>

          {/* Names card */}
          <div className="glass rounded-3xl p-6 md:p-10 mb-6 animate-fade-up delay-100 border border-border/50 shadow-card">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 group">
                <Label htmlFor="name1" className="text-foreground font-accent font-medium flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-soft">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  {t('yourName')}
                </Label>
                <Input
                  id="name1"
                  placeholder={t('enterName')}
                  value={data.name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="h-14 text-lg border-2 border-border bg-background/60 rounded-2xl px-5 focus:border-primary focus:ring-0 transition-all font-accent"
                />
              </div>
              <div className="space-y-3 group">
                <Label htmlFor="name2" className="text-foreground font-accent font-medium flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-soft">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  {t('partnerName')}
                </Label>
                <Input
                  id="name2"
                  placeholder={t('enterName')}
                  value={data.name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="h-14 text-lg border-2 border-border bg-background/60 rounded-2xl px-5 focus:border-primary focus:ring-0 transition-all font-accent"
                />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="glass rounded-3xl p-6 md:p-10 mb-6 animate-fade-up delay-200 border border-border/50 shadow-card">
            <div className="mb-6">
              <h2 className="font-display text-3xl font-normal mb-2 text-foreground flex items-center gap-3">
                <MapPin className="w-7 h-7 text-primary" />
                {t('selectLocations')}
              </h2>
              <p className="text-muted-foreground font-accent">{t('clickToPlace')}</p>
            </div>

            <LazyLoveMap
              location1={data.location1}
              location2={data.location2}
              name1={data.name1}
              name2={data.name2}
              onLocation1Set={setLocation1}
              onLocation2Set={setLocation2}
            />

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                data.location1
                  ? 'border-primary/40 bg-primary/5 shadow-soft'
                  : 'border-border bg-muted/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    data.location1 ? 'bg-gradient-to-br from-rose-400 to-pink-500' : 'bg-muted'
                  }`}>
                    {data.location1 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground font-accent">{t('yourLocation')}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.location1 ? t('selected') : t('notSelected')}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                data.location2
                  ? 'border-orange-400/40 bg-orange-50/30 shadow-soft'
                  : 'border-border bg-muted/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    data.location2 ? 'bg-gradient-to-br from-orange-400 to-rose-500' : 'bg-muted'
                  }`}>
                    {data.location2 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground font-accent">{t('partnerLocation')}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.location2 ? t('selected') : t('notSelected')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-fade-up delay-300">
            <Button
              size="lg"
              onClick={handleCalculate}
              disabled={!isReady}
              className={`gradient-hero text-primary-foreground px-12 py-7 text-base font-semibold rounded-full transition-all duration-500 group font-accent ${
                isReady
                  ? 'shadow-elegant hover:shadow-glow hover:scale-105 animate-pulse-glow'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              {t('calculateLove')}
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            {!isReady && (
              <p className="text-sm text-muted-foreground mt-4 font-accent">
                {completedSteps}/4 {language === 'en' ? 'steps completed' : 'مراحل مکمل'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
