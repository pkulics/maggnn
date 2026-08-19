import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getContent } from '../../api';

/**
 * 收尾 CTA 区块
 * - 单一聚焦主按钮（避免与 Hero 双按钮重复，消除冗余感）
 * - 极淡太极线描水印，与 Hero 太极形成家族呼应而不喧宾夺主
 * - 背景沉淀为 bg-surface-sunken/20，作为页面收尾的视觉沉淀
 */
export default function CTASection({ onStartClick, contentData }) {
  const { i18n, t } = useTranslation();
  const [content, setContent] = useState(null);
  const siteData = contentData?.site;

  useEffect(() => {
    if (contentData && contentData.landing && contentData.landing.cta_section) {
      setContent(contentData.landing.cta_section);
      return;
    }

    const fetchContent = async () => {
      try {
        const data = await getContent(i18n.language);
        if (data && data.landing && data.landing.cta_section) {
          setContent(data.landing.cta_section);
        }
      } catch (e) {
        console.error("Failed to load CTA content", e);
      }
    };
    fetchContent();
  }, [i18n.language, contentData]);

  const title = content?.title || siteData?.landing_cta_title || t('landing.cta_title');
  const ctaPrimary = content?.cta_primary || t('landing.start_button');

  return (
    <section id="landing-cta" className="py-24 relative overflow-hidden bg-surface-sunken/20 scroll-mt-24">
      {/* 星轨环水印，与 Hero 品牌视觉呼应 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="relative w-[480px] max-w-[80%] aspect-square opacity-[0.06]">
          <div className="absolute inset-0 rounded-full border border-brand-main" />
          <div className="absolute inset-[12%] rounded-full border border-brand-main border-dashed" />
          <div className="absolute inset-[25%] rounded-full border border-brand-main" />
          <div className="absolute inset-[37%] rounded-full border border-brand-main border-dashed" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-10 tracking-tight text-content-primary whitespace-pre-line leading-tight">
            {title}
          </h2>

          <button
            onClick={onStartClick}
            className="h-14 px-8 rounded-full bg-brand-main hover:bg-brand-hover text-brand-surface text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base border-0"
          >
            {ctaPrimary}
          </button>
        </div>
      </div>
    </section>
  );
}
