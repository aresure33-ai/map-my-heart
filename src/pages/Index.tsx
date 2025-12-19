import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HeartIcon } from '@/components/HeartIcon';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const isUrdu = language === 'ur';

  const steps = [
    { icon: Heart, titleKey: 'step1Title', descKey: 'step1Desc' },
    { icon: MapPin, titleKey: 'step2Title', descKey: 'step2Desc' },
    { icon: Sparkles, titleKey: 'step3Title', descKey: 'step3Desc' },
  ];

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 text-primary/20 animate-float">
          <HeartIcon />
        </div>
        <div className="absolute top-40 right-20 w-16 h-16 text-coral/30 animate-float-reverse">
          <HeartIcon />
        </div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 text-rose-light animate-float" style={{ animationDelay: '1s' }}>
          <HeartIcon />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-up">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
              {t('heroTitle')}
            </h1>
          </div>
          
          <div className="animate-fade-up delay-200" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t('heroSubtitle')}
            </p>
          </div>

          <div className="animate-fade-up delay-300" style={{ animationDelay: '0.3s' }}>
            <Link to="/test">
              <Button 
                size="lg" 
                className="gradient-hero text-primary-foreground px-10 py-6 text-lg font-semibold rounded-full shadow-glow hover:shadow-soft transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                <HeartIcon className="w-6 h-6 mr-2" />
                {t('startTest')}
              </Button>
            </Link>
          </div>

          {/* Heart Animation */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <HeartIcon className="w-32 h-32 text-primary animate-heartbeat" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-foreground font-display text-2xl font-bold">♥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            {t('howItWorks')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-card p-8 rounded-2xl shadow-card border border-border hover:shadow-soft transition-all duration-300 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-16 h-16 gradient-romantic rounded-full flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4 text-center text-foreground">
                  {t(step.titleKey)}
                </h3>
                <p className="text-muted-foreground text-center">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-romantic">
        <div className="container mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            {language === 'en' ? 'Ready to Discover Your Connection?' : 'اپنا رشتہ دریافت کرنے کے لیے تیار ہیں؟'}
          </h2>
          <Link to="/test">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-10 py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300"
            >
              {t('startTest')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-card border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Made with <HeartIcon className="w-4 h-4 text-primary" /> for love
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
