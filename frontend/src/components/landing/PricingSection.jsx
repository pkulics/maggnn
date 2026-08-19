import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getPlans } from '../../api/payment';
import { useState, useEffect } from 'react';

export default function PricingSection({ contentData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [plansData, setPlansData] = useState(null);

  // 价格单一来源：后端 /api/payment/plans（失败时回退内容配置）
  useEffect(() => {
    getPlans()
      .then(res => setPlansData(res))
      .catch(() => {});
  }, []);

  const pricingData = contentData?.pricing || contentData?.landing?.pricing || contentData?.pages?.pricing;

  const tiers = useMemo(() => {
    const raw = Array.isArray(pricingData?.tiers) ? pricingData.tiers : [];
    if (raw.length > 0) {
      const plans = Array.isArray(plansData?.plans) ? plansData.plans : [];
      return raw.slice(0, 3).map(tier => {
        const name = String(tier.name || '').toLowerCase();
        const monthly = plans.find(p => p.tier === name && p.cycle === 'monthly');
        if (monthly && Number.isFinite(Number(monthly.price))) {
          return { ...tier, price: String(Number(Number(monthly.price).toFixed(2))) };
        }
        return tier;
      });
    }

    return [
      {
        name: t('landing.pricing.free', 'Free'),
        price: '0',
        period: t('pricing.period_month', '/mo'),
        features: [
          t('landing.pricing.free_f1', 'Basic access'),
          t('landing.pricing.free_f2', 'Limited usage'),
        ],
        highlight: false,
      },
      {
        name: t('landing.pricing.pro', 'Pro'),
        price: '9.9',
        period: t('pricing.period_month', '/mo'),
        features: [
          t('landing.pricing.pro_f1', 'More credits'),
          t('landing.pricing.pro_f2', 'Priority responses'),
        ],
        highlight: true,
        highlightText: t('landing.pricing.most_popular', 'Most Popular'),
      },
      {
        name: t('landing.pricing.expert', 'Expert'),
        price: '19.9',
        period: t('pricing.period_month', '/mo'),
        features: [
          t('landing.pricing.expert_f1', 'Maximum credits'),
          t('landing.pricing.expert_f2', 'Premium support'),
        ],
        highlight: false,
      },
    ];
  }, [pricingData, plansData, t]);

  const title = pricingData?.title || t('landing.pricing_title', 'Simple pricing');
  const cta = t('landing.pricing_cta', 'View full pricing');

  return (
    <section id="landing-pricing" className="py-24 bg-surface-sunken/20 scroll-mt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-content-primary">{title}</h2>
        </div>

        {/* 移动端轮播 */}
        <div className="lg:hidden flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory pt-6 pb-3 px-1 [-webkit-overflow-scrolling:touch] max-w-6xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tiers.map((tier, idx) => {
            const isHighlighted = !!tier.highlight;
            const features = Array.isArray(tier.features) ? tier.features : [];
            const tierKey = `${tier.name ?? 'tier'}-${tier.price ?? idx}`;

            return (
              <div
                key={tierKey}
                className={`relative min-w-[80%] sm:min-w-[60%] shrink-0 snap-start rounded-xl p-6 border-0 flex flex-col ${
                  isHighlighted
                    ? 'bg-brand-main/10 ring-1 ring-brand-main/30'
                    : 'bg-surface-sunken/40'
                }`}
              >
                {isHighlighted && tier.highlightText && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-brand-main text-brand-surface text-xs font-bold px-3 py-1 rounded-full">
                      {tier.highlightText}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-content-primary">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
                    <span className="text-sm font-medium text-content-muted">{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {features.map((feature, fIdx) => (
                    <li key={`${tierKey}-${feature ?? fIdx}`} className="flex items-start gap-2">
                      <div className="rounded-full p-0.5 flex-shrink-0 bg-brand-subtle mt-0.5">
                        <Check className="w-3 h-3 text-brand-text" />
                      </div>
                      <span className="text-xs leading-5 text-content-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/pricing')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] mt-auto ${
                    isHighlighted
                      ? 'bg-brand-main text-brand-surface hover:bg-brand-hover'
                      : 'bg-surface-sunken text-content-primary hover:bg-brand-main/10 hover:text-brand-text'
                  }`}
                >
                  {cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* 桌面端网格 */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => {
            const isHighlighted = !!tier.highlight;
            const features = Array.isArray(tier.features) ? tier.features : [];
            const tierKey = `${tier.name ?? 'tier'}-${tier.price ?? idx}`;

            return (
              <div
                key={tierKey}
                className={`relative rounded-xl p-6 border-0 flex flex-col ${
                  isHighlighted
                    ? 'bg-brand-main/10 ring-1 ring-brand-main/30'
                    : 'bg-surface-sunken/40'
                }`}
              >
                {isHighlighted && tier.highlightText && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-main text-brand-surface text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.highlightText}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3 text-content-primary">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
                    <span className="text-sm font-medium text-content-muted">{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {features.map((feature, fIdx) => (
                    <li key={`${tierKey}-${feature ?? fIdx}`} className="flex items-start gap-2">
                      <div className="rounded-full p-0.5 flex-shrink-0 bg-brand-subtle mt-0.5">
                        <Check className="w-3 h-3 text-brand-text" />
                      </div>
                      <span className="text-xs leading-5 text-content-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/pricing')}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] mt-auto ${
                    isHighlighted
                      ? 'bg-brand-main text-brand-surface hover:bg-brand-hover'
                      : 'bg-surface-sunken text-content-primary hover:bg-brand-main/10 hover:text-brand-text'
                  }`}
                >
                  {cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
