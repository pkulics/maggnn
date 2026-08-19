import { motion } from 'framer-motion';

/**
 * 品牌视觉 — 星轨环
 * 同心圆环缓慢旋转，中心柔和光晕，粒子沿轨道运行
 * 风格：简洁、科技感、东方命理的"星辰运行"隐喻
 */
export default function TaijiGraphic() {
  // 三层环，不同速度旋转
  const rings = [
    { size: 100, duration: 60, opacity: 0.12, dashed: false },
    { size: 75, duration: 40, opacity: 0.18, dashed: true },
    { size: 50, duration: 25, opacity: 0.25, dashed: false },
  ];

  // 轨道粒子
  const orbits = [
    { radius: 50, count: 3, size: 3, duration: 20, color: 'bg-brand-main' },
    { radius: 37.5, count: 2, size: 2, duration: 14, color: 'bg-brand-text' },
  ];

  return (
    <div className="relative w-full max-w-[380px] aspect-square mx-auto flex items-center justify-center">
      {/* 中心光晕 */}
      <div className="absolute w-1/4 h-1/4 rounded-full bg-brand-main/15 blur-2xl" />
      <div className="absolute w-3/5 h-3/5 rounded-full bg-brand-subtle/30 blur-3xl" />

      {/* 中心实心点 */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-2 h-2 rounded-full bg-brand-main z-10"
      />

      {/* 同心环 */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border border-brand-main"
          style={{
            width: `${ring.size}%`,
            height: `${ring.size}%`,
            opacity: ring.opacity,
            borderStyle: ring.dashed ? 'dashed' : 'solid',
          }}
        />
      ))}

      {/* 轨道粒子 */}
      {orbits.map((orbit, oi) =>
        Array.from({ length: orbit.count }).map((_, pi) => {
          const angle = (pi / orbit.count) * 360 + oi * 60;
          return (
            <motion.div
              key={`${oi}-${pi}`}
              animate={{ rotate: 360 }}
              transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
              className="absolute"
              style={{ width: '100%', height: '100%' }}
            >
              <div
                className={`absolute rounded-full ${orbit.color}`}
                style={{
                  width: `${orbit.size}px`,
                  height: `${orbit.size}px`,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(${orbit.radius}%) translate(-50%, -50%)`,
                  marginLeft: `-${orbit.size / 2}px`,
                  marginTop: `-${orbit.size / 2}px`,
                }}
              />
            </motion.div>
          );
        })
      )}

      {/* 四方定位点（暗示方位/宫位） */}
      {[
        { top: '0%', left: '50%' },
        { top: '50%', left: '100%' },
        { top: '100%', left: '50%' },
        { top: '50%', left: '0%' },
      ].map((pos, i) => (
        <motion.div
          key={`pin-${i}`}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
          className="absolute w-1.5 h-1.5 rounded-full bg-brand-text/40"
          style={{
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
