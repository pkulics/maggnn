import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Shield, Compass, BookOpen, Heart } from 'lucide-react';
import PageLayout from './PageLayout';
import { getContent } from '../../api';
import { useTranslation } from 'react-i18next';
import { getGenericPageSeo } from '../../utils/seoConfig';
import { useRouteSeo } from '../../utils/seoRuntime';

const ICON_MAP = { Mail, MessageCircle, Shield, Compass, BookOpen, Heart };
const getIcon = (name) => ICON_MAP[name] || Compass;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function AboutPage({ onLoginClick, onRegisterClick }) {
  const { i18n } = useTranslation();
  const [dbData, setDbData] = useState(null);
  const [siteData, setSiteData] = useState(null);

  // 路由级 SEO：SPA 内跳转时也保证标题/描述/canonical 正确
  useRouteSeo(
    '/about',
    (lang) =>
      getGenericPageSeo({
        pageKey: 'about',
        pageData: dbData,
        siteData,
        lang: lang || 'en',
        siteUrl: window.location.origin,
      }),
    [dbData, i18n.language, siteData]
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const content = await getContent(i18n.language);
        setDbData(content?.pages?.about || null);
        setSiteData(content?.site || null);
      } catch (e) {
        // 静默失败，DB 数据缺失时显示空状态
      }
    };
    fetch();
  }, [i18n.language]);

  // 数据完全由 DB 承载，无硬编码 fallback
  const hero = dbData?.hero || {};
  const values = (dbData?.values || []).map(v => ({ ...v, icon: getIcon(v.icon) }));
  const contact = dbData?.contact || {};
  const disclaimer = dbData?.disclaimer || '';

  return (
    <PageLayout onLoginClick={onLoginClick} onRegisterClick={onRegisterClick}>
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary mb-6">
            {hero.title}
          </h1>
          <p className="text-lg text-content-secondary leading-relaxed max-w-2xl mx-auto">
            {hero.desc}
          </p>
        </motion.div>

        {/* 价值观 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 2) * 0.1 }}
                className="p-6 rounded-xl bg-surface-raised"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-subtle flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-main" />
                </div>
                <h3 className="font-semibold text-content-primary mb-2">{item.title}</h3>
                <p className="text-sm text-content-tertiary leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 联系方式 */}
        <motion.div {...fadeUp} className="p-8 rounded-xl bg-surface-raised text-center">
          <div className="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-brand-main" />
          </div>
          <h2 className="font-serif text-xl font-bold text-content-primary mb-2">{contact.title}</h2>
          <p className="text-sm text-content-tertiary mb-6">
            {contact.desc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {(contact.items || []).map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <span className="text-sm font-medium text-content-secondary">{c.label}</span>
                <a
                  href={`mailto:${c.email}`}
                  className="text-sm text-brand-main hover:underline"
                >
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 免责声明 */}
        <motion.div
          {...fadeUp}
          className="mt-12 p-6 rounded-xl bg-surface-sunken/40 text-center"
        >
          <MessageCircle className="w-5 h-5 text-content-muted mx-auto mb-3" />
          <p className="text-xs text-content-muted leading-relaxed max-w-xl mx-auto">
            {disclaimer}
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
