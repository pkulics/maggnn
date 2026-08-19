import React, { useState, useEffect } from 'react';
import { MessageSquare, Sun, Moon, Hexagon, BrainCircuit, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getContent } from '../../api';

const ICONS = {
  chat: MessageSquare,
  bazi: Sun,
  ziwei: Moon,
  meihua: Hexagon,
  psych: BrainCircuit,
  love: Heart,
  relationship: Users
};

export default function FeaturesSection({ contentData }) {
  const { t, i18n } = useTranslation();
  const [features, setFeatures] = useState([]);
  const [featuresMeta, setFeaturesMeta] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    if (contentData) {
      if (contentData.features) {
        setFeatures(contentData.features);
        setActiveFeature(contentData.features[0]);
      }
      if (contentData.features_meta) {
        setFeaturesMeta(contentData.features_meta);
      }
      return;
    }

    const fetchContent = async () => {
      try {
        const content = await getContent(i18n.language);
        if (content) {
          if (content.features) {
            setFeatures(content.features);
            setActiveFeature(content.features[0]);
          }
          if (content.features_meta) {
            setFeaturesMeta(content.features_meta);
          }
        }
      } catch (error) {
        console.error("Failed to load features content", error);
      }
    };

    fetchContent();
  }, [i18n.language, contentData]);

  if (!activeFeature) return null;

  const title = featuresMeta?.title || t('landing.features_title');
  const subtitle = featuresMeta?.subtitle || t('landing.features_subtitle');

  return (
    <section id="landing-features" className="py-24 bg-surface-base scroll-mt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section 标题 */}
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-text/60 mb-3">{t('landing.eyebrow.features')}</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-content-primary">{title}</h2>
          <p className="text-lg text-content-secondary max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* 功能切换标签 - 紧凑横排 */}
        <div className="flex gap-2 mb-12 overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap justify-start md:justify-center px-1 snap-x snap-mandatory md:snap-none pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {features.map((feature) => {
            const Icon = ICONS[feature.id] || MessageSquare;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border-0 text-sm ${
                  activeFeature.id === feature.id
                    ? "bg-brand-main text-brand-surface"
                    : "bg-surface-sunken/40 text-content-secondary hover:bg-surface-sunken/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* 功能详情 - 左右交替布局 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            key={`${activeFeature.id}-text`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-brand-subtle/50 text-brand-text">
              {(() => {
                const Icon = ICONS[activeFeature.id] || MessageSquare;
                return <Icon className="w-5 h-5" />;
              })()}
            </div>
            <h3 className="text-2xl font-bold text-content-primary">{activeFeature.title}</h3>
            <p className="text-base text-content-secondary leading-relaxed">
              {activeFeature.description}
            </p>
          </motion.div>

          {Array.isArray(activeFeature.bullets) && activeFeature.bullets.length > 0 && (
            <motion.div
              key={`${activeFeature.id}-bullets`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <ul className="space-y-3">
                {activeFeature.bullets.map((item, index) => (
                  <li key={`${activeFeature.id}-bullet-${index}`} className="flex gap-3 text-content-secondary">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-main shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
