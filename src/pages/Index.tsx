import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { HeartIcon } from '@/components/HeartIcon';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Sparkles, ArrowRight, Stars } from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();
  const isUrdu = language === 'ur';

  const steps = [
    { icon: Heart, titleKey: 'step1Title', descKey: 'step1Desc', color: 'from-rose-400 to-pink-500' },
    { icon: MapPin, titleKey: 'step2Title', descKey: 'step2Desc', color: 'from-orange-400 to-rose-500' },
    { icon: Sparkles, titleKey: 'step3Title', descKey: 'step3Desc', color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className={`min-h-screen mesh-bg relative overflow-x-hidden ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 animate-blob"
        style={{ background: 'radial-gradient(circle, hsl(345 90% 70%) 0%, transparent 70%)' }} />
      <div className="pointer-events-none fixed top-[40%] right-[-15%] w-[600px] h-[600px] rounded-full opacity-25 animate-blob"
        style={{ background: 'radial-gradient(circle, hsl(15 95% 70%) 0%, transparent 70%)', animationDelay: '4s' }} />
      <div className="pointer-events-none fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full opacity-25 animate-blob"
        style={{ background: 'radial-gradient(circle, hsl(38 95% 70%) 0%, transparent 70%)', animationDelay: '8s' }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <HeartIcon className="w-8 h-8 text-primary animate-heartbeat transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-lg opacity-50 text-primary"><HeartIcon className="w-8 h-8" /></div>
            </div>
            <span className="font-display text-2xl font-medium text-foreground tracking-tight">
              love<span className="text-gradient italic">mapped</span>
            </span>
          </Link>
          <LanguageToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8">
            <Stars className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80 font-accent">{t('welcome')}</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-display text-5xl md:text-7xl lg:text-8xl font-normal mb-8 text-foreground leading-[0.95] tracking-tight">
            <span className="block">{t('heroTitle').split(' ').slice(0, -2).join(' ')}</span>
            <span className="block italic text-gradient mt-2">
              {t('heroTitle').split(' ').slice(-2).join(' ')}
            </span>
          </h1>

          <p className="animate-fade-up delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-accent leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/test">
              <Button
                size="lg"
                className="gradient-hero text-primary-foreground px-10 py-7 text-base font-semibold rounded-full shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-105 group font-accent"
              >
                <HeartIcon className="w-5 h-5 mr-2 group-hover:animate-heartbeat" />
                {t('startTest')}
                <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Visual centerpiece */}
          <div className="animate-fade-up delay-500 mt-20 relative flex justify-center items-center">
            <div className="absolute w-72 h-72 rounded-full gradient-aurora opacity-30 blur-3xl animate-pulse-glow" />
            <div className="relative">
              <div className="absolute -top-8 -left-12 text-rose-400/60 animate-float">
                <HeartIcon className="w-10 h-10" />
              </div>
              <div className="absolute -top-4 -right-16 text-orange-400/60 animate-float-reverse" style={{ animationDelay: '1s' }}>
                <HeartIcon className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-6 left-16 text-amber-400/60 animate-float" style={{ animationDelay: '2s' }}>
                <HeartIcon className="w-6 h-6" />
              </div>
              <HeartIcon className="w-40 h-40 md:w-52 md:h-52 text-primary animate-heartbeat drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-up">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-3 font-accent">{language === 'en' ? 'Process' : 'طریقہ'}</p>
            <h2 className="font-display text-4xl md:text-5xl font-normal text-foreground">
              {t('howItWorks').split(' ')[0]} <span className="italic text-gradient">{t('howItWorks').split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative animate-fade-up"
                style={{ animationDelay: `${0.15 * (index + 1)}s` }}
              >
                <div className="absolute inset-0 gradient-aurora opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-opacity duration-700" />
                <div className="relative glass rounded-3xl p-8 h-full border border-border/50 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-elegant">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-soft group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-display text-5xl text-muted-foreground/30 italic">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-2xl font-medium mb-3 text-foreground">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-muted-foreground font-accent leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden gradient-romantic p-12 md:p-16 text-center shadow-elegant noise">
            <div className="absolute top-6 left-6 text-white/20"><HeartIcon className="w-20 h-20 animate-float" /></div>
            <div className="absolute bottom-6 right-6 text-white/20"><HeartIcon className="w-16 h-16 animate-float-reverse" /></div>
            
            <h2 className="font-display text-4xl md:text-5xl font-normal mb-6 text-white relative z-10 leading-tight">
              {language === 'en' ? (
                <>Ready to discover your <span className="italic">connection</span>?</>
              ) : (
                <>اپنا <span className="italic">رشتہ</span> دریافت کرنے کے لیے تیار ہیں؟</>
              )}
            </h2>
            <p className="text-white/85 mb-8 max-w-md mx-auto font-accent">
              {language === 'en' ? 'Just two names, two pins, one beautiful answer.' : 'صرف دو نام، دو پن، ایک خوبصورت جواب۔'}
            </p>
            <Link to="/test">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 px-10 py-7 text-base font-semibold rounded-full shadow-soft hover:scale-105 transition-all duration-300 group font-accent"
              >
                {t('startTest')}
                <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground font-accent text-sm">
          <p className="flex items-center justify-center gap-2">
            {language === 'en' ? 'Made with' : 'بنایا گیا'} <HeartIcon className="w-4 h-4 text-primary animate-heartbeat" /> {language === 'en' ? 'for love' : 'محبت کے لیے'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
