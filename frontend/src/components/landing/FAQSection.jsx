import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQSection({ contentData }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const items = useMemo(() => {
    const raw = contentData?.faq?.items || contentData?.landing?.faq?.items || contentData?.faq;
    if (Array.isArray(raw) && raw.length > 0) return raw;

    return [
      {
        q: t('landing.faq_q1', 'Is this a prediction service?'),
        a: t('landing.faq_a1', 'No. It is intended for entertainment and cultural learning, not a guarantee or commitment.'),
      },
      {
        q: t('landing.faq_q2', 'Do I need an account to try?'),
        a: t('landing.faq_a2', 'You can browse public pages, and create an account to unlock full features and history.'),
      },
      {
        q: t('landing.faq_q3', 'How do subscriptions work?'),
        a: t('landing.faq_a3', 'Plans are managed on the pricing page. You can upgrade, cancel, or switch billing cycles anytime.'),
      },
    ];
  }, [contentData, t]);

  const title = contentData?.faq?.title || contentData?.landing?.faq?.title || t('landing.faq_title', 'FAQ');

  return (
    <section id="landing-faq" className="py-24 bg-surface-base scroll-mt-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-content-primary">{title}</h2>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => {
            const question = item.question ?? item.q;
            const answer = item.answer ?? item.a;
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-surface-sunken/40 hover:bg-surface-sunken/60 rounded-xl overflow-hidden border-0 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-content-primary">{question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-content-tertiary transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed text-content-secondary">{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
