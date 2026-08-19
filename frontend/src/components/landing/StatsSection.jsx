import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Wrench, Activity, TrendingUp } from 'lucide-react';
import api from '../../api';

/* ============================================================
   运营数据展示 — 懒加载，仅在进入视口时请求 /api/stats/public
   ============================================================ */

// 数字格式化：1000+ / 1.2k+
const formatNum = (n) => {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

// 单个统计卡片
const StatCard = ({ icon: Icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="text-center"
  >
    <div className="w-12 h-12 rounded-full bg-brand-subtle flex items-center justify-center mx-auto mb-3">
      <Icon className="w-6 h-6 text-brand-main" />
    </div>
    <div className="font-serif text-3xl font-bold text-content-primary mb-1 tabular-nums">
      {value}
    </div>
    <div className="text-sm text-content-muted">{label}</div>
  </motion.div>
);

export default function StatsSection({ contentData }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);

  // 懒加载：进入视口才请求
  useEffect(() => {
    if (loaded) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loaded) {
          setLoaded(true);
          observer.disconnect();
          try {
            const res = await api.get('/stats/public');
            setStats(res.data);
          } catch (e) {
            // 静默失败，不影响页面
          } finally {
            setLoading(false);
          }
        }
      },
      { rootMargin: '200px' } // 提前 200px 触发
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded]);

  // 文案来自 CMS（contentData.stats），兜底保留原硬编码默认值
  const statsContent = contentData?.stats;
  const title = statsContent?.title || '数据见证成长';
  const labels = statsContent?.labels || {};
  const labelUsers = labels.users || '注册用户';
  const labelMessages = labels.messages || '问答次数';
  const labelToolCalls = labels.tool_calls || '工具调用';
  const labelActive24h = labels.active_24h || '24h 活跃';

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-content-primary">
            {title}
          </h2>
        </div>

        {loading ? (
          // 骨架屏
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-surface-sunken mx-auto mb-3" />
                <div className="h-8 w-20 bg-surface-sunken rounded mx-auto mb-2" />
                <div className="h-4 w-16 bg-surface-sunken rounded mx-auto" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* 核心数据卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <StatCard icon={Users} value={formatNum(stats.total_users)} label={labelUsers} delay={0} />
              <StatCard icon={MessageCircle} value={formatNum(stats.total_messages)} label={labelMessages} delay={0.1} />
              <StatCard icon={Wrench} value={formatNum(stats.total_tool_calls)} label={labelToolCalls} delay={0.2} />
              <StatCard icon={Activity} value={formatNum(stats.active_users_24h)} label={labelActive24h} delay={0.3} />
            </div>

            {/* 增长曲线 */}
            {stats.growth_curve && stats.growth_curve.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-8 rounded-xl bg-surface-raised"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-brand-main" />
                  <h3 className="font-semibold text-content-primary">近 7 日活跃趋势</h3>
                </div>
                <div className="flex items-end justify-between gap-2 h-40">
                  {stats.growth_curve.map((d, i) => {
                    const maxMsg = Math.max(...stats.growth_curve.map((g) => g.messages), 1);
                    const heightPct = (d.messages / maxMsg) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-t-lg bg-brand-main/20 hover:bg-brand-main/40 transition-colors relative group"
                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                          >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-content-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tabular-nums">
                              {d.messages}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-content-muted tabular-nums">{d.date}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          // 加载失败也不显示错误，保持页面干净
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={Users} value="—" label={labelUsers} delay={0} />
            <StatCard icon={MessageCircle} value="—" label={labelMessages} delay={0.1} />
            <StatCard icon={Wrench} value="—" label={labelToolCalls} delay={0.2} />
            <StatCard icon={Activity} value="—" label={labelActive24h} delay={0.3} />
          </div>
        )}
      </div>
    </section>
  );
}
