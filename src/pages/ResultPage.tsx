import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLoveTest } from '@/contexts/LoveTestContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HeartIcon } from '@/components/HeartIcon';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Share2, RotateCcw, MapPin } from 'lucide-react';

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

    // Animate score counting up
    const duration = 2000;
    const steps = 60;
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

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-coral';
    return 'text-gold';
  };

  const calculateDistance = (): string => {
    if (!data.location1 || !data.location2) return '0';
    const R = 6371; // Earth's radius in km
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
        // User cancelled or error
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

  return (
    <div className={`min-h-screen gradient-soft ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            <HeartIcon className="w-8 h-8" />
          </div>
        ))}
      </div>

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

      <main className="pt-24 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card rounded-3xl shadow-card border border-border p-8 md:p-12 text-center animate-scale-up">
            {/* Names */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="font-display text-2xl md:text-3xl font-bold text-primary">
                {data.name1}
              </span>
              <HeartIcon className="w-10 h-10 text-heart animate-heartbeat" />
              <span className="font-display text-2xl md:text-3xl font-bold text-coral">
                {data.name2}
              </span>
            </div>

            {/* Score Circle */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${animatedScore * 2.83} 283`}
                  className="transition-all duration-100"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(350, 80%, 60%)" />
                    <stop offset="50%" stopColor="hsl(15, 85%, 65%)" />
                    <stop offset="100%" stopColor="hsl(45, 90%, 55%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display text-5xl font-bold ${getScoreColor(animatedScore)}`}>
                  {animatedScore}%
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {t('loveScore')}
                </span>
              </div>
            </div>

            {/* Message */}
            {showResult && (
              <div className="animate-fade-up">
                <p className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  {getLoveMessage(data.score)}
                </p>

                {/* Distance */}
                <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full mb-8">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    {t('distance')}: <strong className="text-foreground">{calculateDistance()} {t('km')}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleShare}
                className="gradient-hero text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <Share2 className="w-5 h-5 mr-2" />
                {t('shareResult')}
              </Button>
              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {t('tryAgain')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
