import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoveTest } from '@/contexts/LoveTestContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HeartIcon } from '@/components/HeartIcon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Share2, RotateCcw, MapPin, Sparkles } from 'lucide-react';

const ResultPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data, reset } = useLoveTest();
  const isUrdu = language === 'ur';
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!data.score) {
      navigate('/test');
      return;
    }

    const duration = 2200;
    const steps = 70;
    const increment = data.score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= data.score) {
        setAnimatedScore(data.score);
        clearInterval(timer);
        setTimeout(() => setShowResult(true), 300);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [data.score, navigate]);

  const getLoveMessage = (score: number): string => {
    if (score >= 90) return t('soulmates');
    if (score >= 80) return t('perfectMatch');
    if (score >= 70) return t('strongBond');
    if (score >= 60) return t('goodConnection');
    if (score >= 50) return t('growingLove');
    return t('newBeginning');
  };

  const calculateDistance = (): string => {
    if (!data.location1 || !data.location2) return '0';
    const R = 6371;
    const dLat = (data.location2.lat - data.location1.lat) * Math.PI / 180;
    const dLon = (data.location2.lng - data.location1.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(data.location1.lat * Math.PI / 180) * Math.cos(data.location2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(0);
  };

  const handleShare = async () => {
    const shareText = language === 'en'
      ? `💕 ${data.name1} & ${data.name2}'s Love Score: ${data.score}%! ${getLoveMessage(data.score || 0)} Try your love test at:`
      : `💕 ${data.name1} اور ${data.name2} کا محبت کا اسکور: ${data.score}%! ${getLoveMessage(data.score || 0)} اپنا محبت کا ٹیسٹ آزمائیں:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Love Test Result',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      toast.success(t('copied'));
    }
  };

  const handleTryAgain = () => {
    reset();
    navigate('/test');
  };

  if (!data.score) return null;

  // dynamic gradient by score
  const scoreGradient =
    data.score >= 80 ? 'from-rose-500 via-pink-500 to-fuchsia-500'
    : data.score >= 60 ? 'from-orange-400 via-rose-500 to-pink-500'
    : 'from-amber-400 via-orange-400 to-rose-400';

  return (
    <div className={`min-h-screen mesh-bg relative overflow-hidden ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/15 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
            }}
          >
            <HeartIcon className="w-6 h-6" />
          </div>
        ))}
      </div>

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
      </nav>

      <main className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center relative z-10">
        <div className="container mx-auto max-w-2xl">
          <div className="glass rounded-[2rem] border border-border/50 shadow-elegant p-8 md:p-12 text-center animate-scale-up noise relative overflow-hidden">
            {/* Subtle gradient backdrop */}
            <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-br ${scoreGradient} opacity-20 blur-3xl`} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider uppercase text-primary font-accent">
                  {language === 'en' ? 'Your Result' : 'آپ کا نتیجہ'}
                </span>
              </div>

              {/* Names */}
              <div className="flex items-center justify-center gap-3 md:gap-5 mb-10 flex-wrap">
                <span className="font-display text-2xl md:text-4xl italic text-foreground">
                  {data.name1}
                </span>
                <div className="relative">
                  <HeartIcon className="w-8 h-8 md:w-10 md:h-10 text-primary animate-heartbeat" />
                  <div className="absolute inset-0 blur-xl text-primary/60"><HeartIcon className="w-8 h-8 md:w-10 md:h-10" /></div>
                </div>
                <span className="font-display text-2xl md:text-4xl italic text-foreground">
                  {data.name2}
                </span>
              </div>

              {/* Score Circle */}
              <div className="relative w-56 h-56 mx-auto mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke="url(#scoreGradient)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${animatedScore * 2.83} 283`}
                    className="transition-all duration-100 drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(345 85% 60%)" />
                      <stop offset="50%" stopColor="hsl(15 90% 60%)" />
                      <stop offset="100%" stopColor="hsl(38 95% 60%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-6xl md:text-7xl font-normal text-gradient">
                    {animatedScore}
                  </span>
                  <span className="text-sm text-muted-foreground font-accent tracking-widest uppercase mt-1">
                    {t('loveScore')}
                  </span>
                </div>
              </div>

              {showResult && (
                <div className="animate-fade-up">
                  <p className="font-display text-3xl md:text-4xl text-foreground mb-8 italic leading-tight">
                    {getLoveMessage(data.score)}
                  </p>

                  <div className="inline-flex items-center gap-2 glass border border-border px-5 py-2.5 rounded-full mb-10">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground font-accent text-sm">
                      {t('distance')}: <strong className="text-foreground">{calculateDistance()} {t('km')}</strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleShare}
                  className="gradient-hero text-primary-foreground px-8 py-6 font-semibold rounded-full shadow-elegant hover:shadow-glow hover:scale-105 transition-all duration-300 font-accent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t('shareResult')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTryAgain}
                  className="border-2 border-border bg-background/40 hover:bg-primary hover:text-primary-foreground hover:border-primary px-8 py-6 font-semibold rounded-full transition-all duration-300 font-accent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t('tryAgain')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
