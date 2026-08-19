import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function ExamplesSection({ contentData }) {
  const { t } = useTranslation();

  const data = contentData?.examples || contentData?.landing?.examples;
  const title = data?.title || t('landing.examples_title', 'Example insights');
  const subtitle = data?.subtitle || t('landing.examples_subtitle', 'See what you get before you start.');

  const items = useMemo(() => {
    const raw = data?.items;
    if (Array.isArray(raw) && raw.length > 0) return raw.slice(0, 3);

    return [
      {
        title: t('landing.examples_1_title', 'Career direction'),
        content: t(
          'landing.examples_1_body',
          'A concise overview of strengths, timing, and actionable next steps for your work path.',
        ),
      },
      {
        title: t('landing.examples_2_title', 'Relationship patterns'),
        content: t(
          'landing.examples_2_body',
          'Communication style, core needs, and practical suggestions to improve connection.',
        ),
      },
      {
        title: t('landing.examples_3_title', 'Personal growth'),
        content: t(
          'landing.examples_3_body',
          'Key tendencies and habits, with a simple plan to build stability and confidence.',
        ),
      },
    ];
  }, [data, t]);

  return (
    <section id="landing-examples" className="py-24 bg-surface-base scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-content-primary">{title}</h2>
          <p className="text-xl text-content-secondary">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-raised border border-border-subtle rounded-xl p-8 hover:border-border-highlight transition-colors"
            >
              <h3 className="text-xl font-bold text-content-primary mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed text-content-secondary whitespace-pre-line">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

