import { useEffect, useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import UseCasesSection from './UseCasesSection';
import PricingSection from './PricingSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { getContent, trackEvent } from '../../api';
import { useLocation } from 'react-router-dom';
import { getHomeSeo, getLandingFaqItems } from '../../utils/seoConfig';
import { useRouteSeo, injectFaqJsonLd } from '../../utils/seoRuntime';

export default function LandingPage({ onStart, onLogin, onRegister }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [contentData, setContentData] = useState(null);

  // 动态 SEO：API 主权威，getHomeSeo 兜底；contentData 变化时重新应用兜底
  useRouteSeo(
    '/home',
    (lang) => getHomeSeo({ contentData, lang: lang || 'en', siteUrl: window.location.origin }),
    [contentData, i18n.language]
  );

  // FAQ 富结果：独立 JSON-LD 脚本，与主 jsonLd 共存
  useEffect(() => {
    injectFaqJsonLd(getLandingFaqItems(contentData));
    return () => injectFaqJsonLd([]);
  }, [contentData]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const isPreview = params.get('preview') === '1';
        const manualLang = sessionStorage.getItem('maggnn_manual_lang');
        const lang = manualLang || params.get('lang') || i18n.language;

        if (isPreview) {
          const raw = localStorage.getItem(`maggnn_cms_preview_${lang}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (active) setContentData(parsed);
            return;
          }
        }

        const data = await getContent(lang);
        if (active) setContentData(data);
      } catch {
        if (active) setContentData(null);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [i18n.language, location.search]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const isPreview = params.get('preview') === '1';
      const manualLang = sessionStorage.getItem('maggnn_manual_lang');
      const lang = manualLang || params.get('lang') || i18n.language;
      const key = `maggnn_evt_landing_view_${lang}_${isPreview ? 'preview' : 'prod'}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
      trackEvent('landing_view', {
        lang,
        preview: isPreview ? 1 : 0,
        path: location.pathname,
        search: location.search || '',
      });
    } catch {}
  }, [i18n.language, location.pathname, location.search]);

  const handleLogin = () => {
    trackEvent('auth_open', { mode: 'login', source: 'landing' });
    const fn = onLogin || onStart;
    if (fn) fn();
  };

  const handleRegister = () => {
    trackEvent('auth_open', { mode: 'register', source: 'landing' });
    const fn = onRegister || onStart;
    if (fn) fn();
  };

  const handleStart = (source) => {
    trackEvent('cta_primary_click', { source, page: 'landing' });
    if (onStart) onStart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base font-sans text-content-primary">
      <Header onLoginClick={handleLogin} onRegisterClick={handleRegister} contentData={contentData} />
      <main className="flex-grow">
        <HeroSection onStartClick={() => handleStart('hero_primary')} contentData={contentData} />
        <StatsSection contentData={contentData} />
        <UseCasesSection onCtaClick={() => handleStart('use_cases_cta')} contentData={contentData} />
        <PricingSection contentData={contentData} />
        <FAQSection contentData={contentData} />
        <CTASection onStartClick={() => handleStart('cta_section_primary')} contentData={contentData} />
      </main>
      <Footer contentData={contentData} />
    </div>
  );
}
