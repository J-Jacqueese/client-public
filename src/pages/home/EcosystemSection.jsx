import { Boxes, Rocket, Users, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const MODELS_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663303298638/ER9yLJ9G8WWDh2VPWc45Ne/models-card-v2-FEhShagWkEUGafT6ip6W4j.webp';
const APPS_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663303298638/ER9yLJ9G8WWDh2VPWc45Ne/apps-card-v2-VTVZiDxF3PYu3XDoGz2meb.webp';
const COMMUNITY_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663303298638/ER9yLJ9G8WWDh2VPWc45Ne/community-card-v2-VefKQzwMpXkAACrg27ZJMt.webp';

const pillars = [
  {
    icon: Boxes,
    title: '模型库',
    subtitle: 'Model Library',
    desc: '汇聚 DeepSeek 全系列模型及社区微调版本，按行业细分，支持一键部署与评测对比',
    image: MODELS_IMG,
    href: '#/models',
    gradient: 'from-blue-500 to-indigo-500',
    textColor: 'text-blue-600',
  },
  {
    icon: Rocket,
    title: '应用榜',
    subtitle: 'App Leaderboard',
    desc: '发现并支持基于 DeepSeek 生态的创新 AI 产品，社区投票驱动的应用排行榜',
    image: APPS_IMG,
    href: '#/apps',
    gradient: 'from-orange-400 to-rose-400',
    textColor: 'text-orange-600',
  },
  {
    icon: Users,
    title: '开源社区',
    subtitle: 'Open Source Community',
    desc: '全球开发者、研究者与创新者的聚集地，推动开放协作与技术无界流动',
    image: COMMUNITY_IMG,
    href: 'https://deepseek.club/',
    gradient: 'from-amber-400 to-orange-400',
    textColor: 'text-amber-600',
  },
];

export default function EcosystemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-xs text-blue-500/70 tracking-widest uppercase mb-3 block">
            Ecosystem Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            三位一体的 <span className="text-gradient-ocean">AI 生态平台</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            模型库提供技术基座，应用榜孵化创新产品，开源社区连接全球开发者 —— 形成完整的 DeepSeek 生态闭环
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, index) => (
            <motion.a
              key={pillar.title}
              href={pillar.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
              className="group relative rounded-2xl border border-slate-100 hover:border-slate-200 bg-white overflow-hidden transition-all duration-400 hover:shadow-ocean-lg hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center shadow-md`}
                  >
                    <pillar.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-5 pt-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                  <ArrowRight
                    className={`w-4 h-4 ${pillar.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-500 tracking-wider uppercase block mb-2.5">
                  {pillar.subtitle}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{pillar.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

