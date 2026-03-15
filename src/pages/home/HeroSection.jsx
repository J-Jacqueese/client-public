import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Boxes, Rocket, Users, GitBranch } from 'lucide-react';

const HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663303298638/ER9yLJ9G8WWDh2VPWc45Ne/whale-hero-v2-3rMZLe3mLquuKvNJDYxs2z.webp';

const stats = [
  { icon: Boxes, label: '开源模型', value: 500, suffix: '+', color: 'text-blue-600' },
  { icon: Rocket, label: 'AI 应用', value: 1200, suffix: '+', color: 'text-indigo-600' },
  { icon: Users, label: '社区成员', value: 15000, suffix: '+', color: 'text-sky-600' },
  { icon: GitBranch, label: '开源贡献', value: 8600, suffix: '+', color: 'text-teal-600' },
];

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [duration, end, inView]);

  return (
    <span ref={ref} className="font-mono font-bold tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative">
        <div
          className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[560px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        >
          <div className="absolute inset-0 bg-white/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-white/80" />
          <div className="relative z-10 py-14 sm:py-16 md:py-20 w-full">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-3xl mx-auto text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/60 mb-5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-blue-700 tracking-[0.02em]">
                    共建全球最大的第三方 DeepSeek 开源生态社区
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-5 tracking-[-0.03em]">
                  <span className="block">
                    <span className="inline-block text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">共建 </span>
                    <span className="inline-block text-gradient-ocean drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">DeepSeek</span>
                  </span>
                  <span className="block mt-1.5 sm:mt-2 text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                    开源生态
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-lg sm:text-xl font-semibold text-slate-700 mb-2 leading-relaxed tracking-[0.01em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                >
                  科技向善，仝创未来
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-sm text-slate-600 font-mono tracking-[0.08em] mb-7 drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                >
                  模型库 · 应用榜 · 开源社区 —— 三位一体的 AI 生态平台
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <a
                    href="http://dpsk.ai/#/models"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 flex items-center gap-2 text-sm"
                  >
                    探索模型库
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <a
                    href="https://deepseek.club/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-semibold rounded-xl transition-all hover:bg-white shadow-sm text-sm"
                  >
                    加入社区
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 bg-[#f8fafc] pb-8">
        <div className="container -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + index * 0.07, duration: 0.4 }}
                className="p-4 rounded-xl bg-white border border-slate-100 shadow-ocean text-center group hover:shadow-ocean-lg transition-all duration-300"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2 mx-auto opacity-70`} />
                <div className={`text-[22px] sm:text-2xl font-bold tracking-[-0.02em] ${stat.color}`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium tracking-[0.02em]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

