import React, { useState, useEffect, useRef } from 'react';
import { Layout, Globe, PenTool, MessageSquare, Sidebar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getContent } from '../../api';

const ICON_MAP = {
  'Sidebar': Sidebar,
  'Layout': Layout,
  'Globe': Globe,
  'PenTool': PenTool,
  'MessageSquare': MessageSquare
};

export default function UseCasesSection({ onCtaClick, contentData }) {
  const { i18n, t } = useTranslation();
  const [content, setContent] = useState(null);
  const mobileCarouselRef = useRef(null);
  const autoScrollPausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (contentData && contentData.use_cases) {
      setContent(contentData.use_cases);
      return;
    }

    const fetchContent = async () => {
      try {
        const data = await getContent(i18n.language);
        if (data && data.use_cases) {
          setContent(data.use_cases);
        }
      } catch (e) {
        console.error("Failed to load Use Cases content", e);
      }
    };
    fetchContent();
  }, [i18n.language, contentData]);

  const title = content?.title || t('landing.use_cases.title');
  const items = content?.items || [
    {
      icon: "Sidebar",
      title: t('landing.use_cases.items.0.title'),
      description: t('landing.use_cases.items.0.description')
    },
    {
      icon: "Layout",
      title: t('landing.use_cases.items.1.title'),
      description: t('landing.use_cases.items.1.description')
    },
    {
      icon: "Globe",
      title: t('landing.use_cases.items.2.title'),
      description: t('landing.use_cases.items.2.description')
    },
    {
      icon: "PenTool",
      title: t('landing.use_cases.items.3.title'),
      description: t('landing.use_cases.items.3.description')
    },
    {
      icon: "MessageSquare",
      title: t('landing.use_cases.items.4.title'),
      description: t('landing.use_cases.items.4.description')
    }
  ];
  const ctaCard = content?.cta_card || {
    title: t('landing.use_cases.cta.title'),
    description: t('landing.use_cases.cta.description'),
    button: t('landing.use_cases.cta.button')
  };

  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    const pause = () => {
      autoScrollPausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        autoScrollPausedRef.current = false;
      }, 1800);
    };

    const tick = () => {
      if (!mobileCarouselRef.current) return;
      if (autoScrollPausedRef.current) return;
      if (el.scrollWidth <= el.clientWidth + 4) return;

      const firstChild = el.children[0];
      if (!firstChild) return;

      const childWidth = firstChild.getBoundingClientRect().width;
      const styles = getComputedStyle(el);
      const gap =
        parseFloat(styles.columnGap || styles.gap || '0') ||
        parseFloat(styles.rowGap || '0') ||
        0;
      const step = Math.max(1, childWidth + gap);
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft + step >= maxScrollLeft - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      el.scrollBy({ left: step, behavior: 'smooth' });
    };

    const interval = setInterval(tick, 3800);

    el.addEventListener('pointerdown', pause, { passive: true });
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('scroll', pause, { passive: true });

    return () => {
      clearInterval(interval);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('scroll', pause);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [i18n.language, items.length, ctaCard?.title]);

  return (
    <section className="py-24 bg-surface-sunken/20 scroll-mt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-content-primary">{title}</h2>
        </div>

        {/* 移动端轮播 */}
        <div
          ref={mobileCarouselRef}
          className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-1 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map((useCase, index) => {
            const Icon = ICON_MAP[useCase.icon] || MessageSquare;
            return (
              <div
                key={index}
                className="min-w-[80%] shrink-0 snap-start bg-surface-sunken/40 p-6 rounded-xl group border-0"
              >
                <div className="w-10 h-10 bg-brand-subtle/50 text-brand-text rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2 text-content-primary">{useCase.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{useCase.description}</p>
              </div>
            );
          })}

          <div className="min-w-[80%] shrink-0 snap-start bg-brand-main p-6 rounded-xl text-brand-surface flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-bold mb-2">{ctaCard.title}</h3>
            <p className="text-brand-surface/85 text-sm mb-4">{ctaCard.description}</p>
            <button
              onClick={onCtaClick}
              className="bg-brand-surface text-content-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-surface-raised transition-colors"
            >
              {ctaCard.button}
            </button>
          </div>
        </div>

        {/* 桌面端网格 */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((useCase, index) => {
            const Icon = ICON_MAP[useCase.icon] || MessageSquare;
            return (
              <div
                key={index}
                className="bg-surface-sunken/40 p-6 rounded-xl group border-0"
              >
                <div className="w-10 h-10 bg-brand-subtle/50 text-brand-text rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold mb-2 text-content-primary">{useCase.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{useCase.description}</p>
              </div>
            );
          })}

          <div className="bg-brand-main p-6 rounded-xl text-brand-surface flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-bold mb-2">{ctaCard.title}</h3>
            <p className="text-brand-surface/85 text-sm mb-4">{ctaCard.description}</p>
            <button
              onClick={onCtaClick}
              className="bg-brand-surface text-content-primary px-5 py-2 rounded-full text-sm font-bold hover:bg-surface-raised transition-colors"
            >
              {ctaCard.button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
