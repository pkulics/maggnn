import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sun, Moon, Hexagon, Heart, Users, BrainCircuit, TrendingUp, Calendar,
  MessageCircle, Sparkles, Zap, Brain, Shield, Languages,
  BookOpen, Compass, ChevronRight, ArrowRight, Layers, GitBranch,
} from 'lucide-react';
import Header from '../landing/Header';
import Footer from '../landing/Footer';
import { useAuthStore } from '../../stores/authStore';
import { getContent } from '../../api';
import { useTranslation } from 'react-i18next';
import { getGenericPageSeo } from '../../utils/seoConfig';
import { useRouteSeo } from '../../utils/seoRuntime';

// 图标映射
const ICON_MAP = {
  Calendar, Sun, Moon, Hexagon, BrainCircuit, Heart, Users, TrendingUp,
  MessageCircle, Sparkles, Zap, Brain, Shield, Languages, BookOpen, Compass, Layers, GitBranch,
};
const getIcon = (name) => ICON_MAP[name] || Compass;

// ── 使用流程（纯 UI 结构，非业务数据） ──
const STEPS = [
  { num: '01', title: '选择工具', desc: '从 8 种测算工具中选择适合的，或直接开始对话', icon: Layers },
  { num: '02', title: '查看结果', desc: '工具生成命盘、评分、关系分析等结构化结果', icon: BookOpen },
  { num: '03', title: '继续追问', desc: '基于结果自由提问，AI 给出有理有据的深度解读', icon: MessageCircle },
];

// ── 动画配置 ──
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function ProductPage({ onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { i18n } = useTranslation();
  const [dbData, setDbData] = useState(null);
  const [siteData, setSiteData] = useState(null);

  // 路由级 SEO：SPA 内跳转时也保证标题/描述/canonical 正确
  useRouteSeo(
    '/product',
    (lang) =>
      getGenericPageSeo({
        pageKey: 'product',
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
        setDbData(content?.pages?.product || null);
        setSiteData(content?.site || null);
      } catch (e) {
        // 静默失败，DB 数据缺失时显示空状态
      }
    };
    fetch();
  }, [i18n.language]);

  const handleStart = () => navigate('/');

  // 数据完全由 DB 承载，无硬编码 fallback
  const hero = dbData?.hero || {};
  const tools = (dbData?.tools || []).map(t => ({ ...t, icon: getIcon(t.icon) }));
  const characters = dbData?.characters || [];
  const modes = (dbData?.modes || []).map(m => ({ ...m, icon: getIcon(m.icon) }));
  const techFeatures = (dbData?.tech_features || []).map(t => ({ ...t, icon: getIcon(t.icon) }));
  const trustItems = (dbData?.trust_items || []).map(t => ({ ...t, icon: getIcon(t.icon) }));
  const philosophy = dbData?.philosophy || {};
  const cta = dbData?.cta || {};

  return (
    <div className="min-h-screen flex flex-col bg-surface-base font-sans text-content-primary">
      <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} />

      <main className="flex-grow">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-subtle/40 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-content-primary mb-6 leading-tight">
                {hero.title}
              </h1>
              <p className="text-lg sm:text-xl text-content-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleStart}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-main text-white font-medium text-base hover:bg-brand-hover transition-colors shadow-sm"
                >
                  {user ? '开始使用' : '免费开始'}
                </button>
                {!user && (
                  <button
                    onClick={onRegisterClick}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-surface-sunken text-content-primary font-medium text-base hover:bg-surface-raised transition-colors"
                  >
                    注册账号
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 使用流程 ── */}
        <section className="py-16 px-4 border-y border-border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-brand-main" />
                    </div>
                    <div className="font-serif text-sm font-bold text-brand-text mb-2">{step.num}</div>
                    <h3 className="text-lg font-semibold text-content-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-content-secondary leading-relaxed">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 核心工具 ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary">
                8 种测算工具，全品类覆盖
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.name}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: (i % 4) * 0.08 }}
                    className="p-6 rounded-xl bg-surface-raised hover:bg-surface-sunken/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-surface-sunken flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-content-muted px-2 py-0.5 rounded-full bg-surface-sunken">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-content-primary mb-2">{tool.name}</h3>
                    <p className="text-sm text-content-tertiary leading-relaxed mb-3">{tool.desc}</p>
                    <ul className="space-y-1.5">
                      {tool.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-xs text-content-muted">
                          <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-brand-main" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 角色设定 ── */}
        <section className="py-20 px-4 bg-surface-raised">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary">
                3 个角色，3 种对话风格
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {characters.map((char, i) => (
                <motion.div
                  key={char.name}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                  className="p-6 rounded-xl bg-surface-base border border-border-subtle"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{char.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-content-primary">{char.name}</h3>
                      <span className="text-xs text-content-muted">{char.title}</span>
                    </div>
                  </div>
                  <p className="text-sm text-content-secondary leading-relaxed mb-4">{char.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {char.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-surface-sunken text-content-tertiary">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-serif text-brand-text italic">「{char.quote}」</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 问答模式 ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary">
                3 种问答模式，按需选择深度
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map((mode, i) => {
                const Icon = mode.icon;
                return (
                  <motion.div
                    key={mode.name}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                    className={`relative p-6 rounded-xl transition-colors ${
                      mode.featured
                        ? 'bg-brand-main text-white'
                        : 'bg-surface-raised border border-border-subtle'
                    }`}
                  >
                    {mode.featured && (
                      <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                        默认
                      </span>
                    )}
                    <Icon className={`w-6 h-6 mb-3 ${mode.featured ? 'text-white' : 'text-brand-main'}`} />
                    <h3 className={`font-semibold mb-1 ${mode.featured ? 'text-white' : 'text-content-primary'}`}>
                      {mode.name}模式
                    </h3>
                    <p className={`text-sm mb-3 ${mode.featured ? 'text-white/80' : 'text-content-tertiary'}`}>
                      {mode.desc}
                    </p>
                    <p className={`text-xs leading-relaxed mb-4 ${mode.featured ? 'text-white/60' : 'text-content-muted'}`}>
                      {mode.detail}
                    </p>
                    <span className={`text-xs font-mono ${mode.featured ? 'text-white/60' : 'text-content-muted'}`}>
                      积分消耗 {mode.multiplier}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 技术特色 ── */}
        <section className="py-20 px-4 bg-surface-raised">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary">
                不只是测算，更是持续陪伴
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techFeatures.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: (i % 2) * 0.1 }}
                    className="p-6 rounded-xl bg-surface-base"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-subtle flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-main" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-content-primary mb-1">{feat.title}</h3>
                        <p className="text-sm text-content-tertiary leading-relaxed mb-3">{feat.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {feat.points.map((p) => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-surface-sunken text-content-muted">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 信任要素 ── */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-content-primary">
                值得信赖的命理工具
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-brand-main" />
                    </div>
                    <h3 className="font-semibold text-content-primary text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-content-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 产品理念 ── */}
        <section className="py-20 px-4 bg-surface-raised">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
            <Compass className="w-10 h-10 text-brand-main mx-auto mb-6" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-content-primary mb-6 leading-relaxed">
              {philosophy.title}
            </h2>
            <p className="text-content-secondary leading-relaxed mb-4">
              {philosophy.desc}
            </p>
            <p className="text-content-tertiary text-sm leading-relaxed">
              {philosophy.disclaimer}
            </p>
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-4">
          <motion.div
            {...fadeUp}
            className="max-w-2xl mx-auto text-center p-12 rounded-2xl bg-brand-main text-white"
          >
            <h2 className="font-serif text-3xl font-bold mb-8">{cta.title}</h2>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-brand-main font-medium hover:bg-white/90 transition-colors"
            >
              {user ? '开始使用' : '免费开始'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
