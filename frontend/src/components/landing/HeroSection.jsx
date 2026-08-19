import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TaijiGraphic from './TaijiGraphic';

export default function HeroSection({ onStartClick, contentData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const siteData = contentData?.site;

  const content = useMemo(() => {
    if (contentData && contentData.landing && contentData.landing.hero) {
      return contentData.landing.hero;
    }
    return null;
  }, [contentData]);

  const title = content?.title || siteData?.intro_title || t('landing.intro_title');
  const subtitle = content?.subtitle || siteData?.intro_text || t('landing.intro_text');
  const ctaPrimary = content?.cta_primary || t('landing.start_button');
  const ctaSecondary = content?.cta_secondary || t('landing.explore_button');
  const heroImageUrl = typeof siteData?.hero_image_url === 'string' ? siteData.hero_image_url.trim() : '';
  const brandTitle = typeof siteData?.title === 'string' && siteData.title.trim() ? siteData.title.trim() : 'Maggnn';

  const handleExploreClick = () => {
    const el = document.getElementById('landing-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate('/product');
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-surface-base">
      {/* 底层径向渐变叠加，营造清透层次 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 40%, oklch(var(--sys-brand-subtle) / 0.35), transparent 60%)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-content-primary mb-6 whitespace-pre-line leading-[1.1]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg md:text-xl text-content-secondary max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line"
          >
            {subtitle}
          </motion.p>

          {/* CTA 按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <button
              onClick={onStartClick}
              className="h-12 px-7 rounded-full bg-brand-main hover:bg-brand-hover text-brand-surface text-base font-semibold transition-all hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base border-0"
            >
              {ctaPrimary}
            </button>
            <button
              onClick={handleExploreClick}
              className="h-12 px-7 rounded-full text-base font-medium bg-surface-sunken/40 hover:bg-surface-sunken/60 text-content-secondary hover:text-content-primary transition-all w-full sm:w-auto border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              {ctaSecondary}
            </button>
          </motion.div>

          {/* 太极品牌视觉 - 居中下方，更精致 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="mt-16 flex justify-center"
          >
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={brandTitle}
                className="w-full max-w-md mx-auto object-contain drop-shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
              />
            ) : (
              <TaijiGraphic />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
