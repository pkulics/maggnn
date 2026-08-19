import React, { useMemo } from 'react';
import { ShieldCheck, Lock, Globe2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TrustSection({ contentData }) {
  const { t } = useTranslation();

  const items = useMemo(() => {
    const raw = contentData?.trust?.items || contentData?.landing?.trust?.items;
    if (Array.isArray(raw) && raw.length > 0) return raw.slice(0, 4);

    return [
      {
        icon: 'shield',
        title: t('landing.trust_1_title', 'Reliable results'),
        description: t('landing.trust_1_desc', 'Consistent experience across tools and languages.'),
      },
      {
        icon: 'lock',
        title: t('landing.trust_2_title', 'Privacy-first'),
        description: t('landing.trust_2_desc', 'Designed with data minimization and control in mind.'),
      },
      {
        icon: 'globe',
        title: t('landing.trust_3_title', 'Multilingual'),
        description: t('landing.trust_3_desc', 'Localized UI and content for global users.'),
      },
      {
        icon: 'sparkles',
        title: t('landing.trust_4_title', 'Actionable insights'),
        description: t('landing.trust_4_desc', 'Clear explanations and next-step suggestions.'),
      },
    ];
  }, [contentData, t]);

  const title =
    contentData?.trust?.title ||
    contentData?.landing?.trust?.title ||
    contentData?.site?.trust_title ||
    t('landing.trust_title', 'Why users trust Maggnn');

  const iconFor = (id) => {
    if (id === 'lock') return Lock;
    if (id === 'globe') return Globe2;
    if (id === 'sparkles') return Sparkles;
    return ShieldCheck;
  };

  return (
    <section id="landing-trust" className="py-24 bg-surface-sunken/20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-text/60 mb-3">{t('landing.eyebrow.trust')}</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-content-primary">{title}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const Icon = iconFor(item.icon);
            return (
              <div
                key={idx}
                className="bg-surface-sunken/40 rounded-xl p-6 hover:bg-surface-sunken/60 transition-colors border-0"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-subtle/50 text-brand-text flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-content-primary mb-2">{item.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
