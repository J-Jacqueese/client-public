import { ArrowRight, Boxes, Download, Star, Cpu, Brain, Eye, MessageSquare, Code2, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const modelCategories = [
  { icon: Brain, label: 'NLP', count: 128 },
  { icon: Eye, label: '视觉', count: 86 },
  { icon: MessageSquare, label: '对话', count: 95 },
  { icon: Code2, label: '代码', count: 64 },
  { icon: Zap, label: '推理', count: 72 },
  { icon: Cpu, label: '多模态', count: 55 },
];

const featuredModels = [
  {
    name: 'DeepSeek-V3',
    desc: '671B MoE 架构，顶级推理与代码能力',
    tags: ['MoE', '671B', '推理'],
    downloads: '2.8M',
    stars: 4856,
    badge: '热门',
    badgeColor: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  {
    name: 'DeepSeek-R1',
    desc: '强化学习驱动的推理模型，数学与逻辑能力突出',
    tags: ['RL', '推理', '数学'],
    downloads: '1.5M',
    stars: 3241,
    badge: '最新',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    name: 'DeepSeek-Coder-V2',
    desc: '236B 代码生成专家，支持 338+ 编程语言',
    tags: ['代码', '236B', '多语言'],
    downloads: '980K',
    stars: 2876,
    badge: '推荐',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
  },
];

export default function ModelsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <section id="models" className="relative py-20 section-alt" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                <Boxes className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-mono text-xs text-blue-500/60 tracking-widest uppercase">Model Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              行业细化<span className="text-gradient-ocean">模型库</span>
            </h2>
            <p className="text-slate-600 max-w-lg text-sm">
              汇聚 DeepSeek 全系列模型及社区微调版本，覆盖 NLP、视觉、代码、数学等多个领域
            </p>
          </div>
          <a
            href="http://dpsk.ai/#/models"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
          >
            查看全部模型
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {modelCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-sm transition-all ${
                activeCategory === cat.label
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className="text-xs font-mono opacity-60">{cat.count}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredModels.map((model, index) => (
            <motion.a
              key={model.name}
              href="http://dpsk.ai/#/models"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + index * 0.06, duration: 0.45 }}
              className="block card-ocean rounded-xl p-5 h-full"
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="font-mono font-semibold text-slate-900 text-sm">{model.name}</h3>
                </div>
                {model.badge && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                    {model.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{model.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {model.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {model.downloads}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  {model.stars.toLocaleString()}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="http://dpsk.ai/#/models"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            查看全部模型
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

