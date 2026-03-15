import {
  ArrowRight,
  Rocket,
  TrendingUp,
  ThumbsUp,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const hotApps = [
  {
    rank: 1,
    name: 'DeepSeek Chat',
    desc: '官方对话助手，支持深度推理与代码生成',
    category: 'AI 助手',
    votes: 12800,
    trend: '+23%',
    isHot: true,
  },
  {
    rank: 2,
    name: 'OpenClaw',
    desc: '开源 AI Agent 框架，一键部署智能助手',
    category: 'Agent 框架',
    votes: 9650,
    trend: '+45%',
    isHot: true,
  },
  {
    rank: 3,
    name: 'DS-Coder IDE',
    desc: '基于 DeepSeek-Coder 的智能编程环境',
    category: '开发工具',
    votes: 7420,
    trend: '+18%',
    isHot: false,
  },
];

function getRankStyle(rank) {
  if (rank === 1)
    return 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-400/20';
  if (rank === 2)
    return 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md shadow-slate-300/20';
  if (rank === 3)
    return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/20';
  return 'bg-slate-100 text-slate-500';
}

export default function AppsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState('全部');
  const appCategories = ['全部', 'AI 助手', 'Agent 框架', '开发工具', '教育', '企业工具'];

  return (
    <section id="apps" className="relative py-20" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-sm">
                <Rocket className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-mono text-xs text-orange-500/60 tracking-widest uppercase">App Leaderboard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              AI <span className="text-gradient-ocean">应用航海榜</span>
            </h2>
            <p className="text-slate-600 max-w-lg text-sm">
              发现、体验并支持基于 DeepSeek 生态的创新 AI 产品，每周更新排名
            </p>
          </div>
          <a
            href="http://dpsk.ai/#/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
          >
            查看完整榜单
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {appCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === cat
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-blue-600 border border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-3">
            {hotApps.map((app, index) => (
              <motion.a
                key={app.name}
                href="http://dpsk.ai/#/apps"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 + index * 0.07, duration: 0.45 }}
                className="group flex items-center gap-4 p-4 rounded-xl card-ocean"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${getRankStyle(
                    app.rank,
                  )}`}
                >
                  {app.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {app.name}
                    </h3>
                    {app.isHot && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{app.desc}</p>
                </div>

                <span className="hidden sm:block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 shrink-0">
                  {app.category}
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <ThumbsUp className="w-3 h-3" />
                    {app.votes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-mono">
                    <TrendingUp className="w-3 h-3" />
                    {app.trend}
                  </span>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5">
                <div className="flex items-center gap-2 mb-2.5">
                  <Award className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-white text-sm">创业者扶持</h3>
                </div>
                <p className="text-sm text-blue-100/80 mb-4 leading-relaxed">
                  入选本周前三名的应用，将获得官方社区置顶引流与媒体采访机会
                </p>
                <a
                  href="http://dpsk.ai/#/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                >
                  了解更多
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="card-ocean rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <h3 className="font-semibold text-slate-900 text-sm">新上线应用</h3>
              </div>
              <div className="space-y-3">
                {['AI 论文助手', '智能客服 Bot', '数据可视化平台'].map((name, i) => (
                  <div key={name} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 flex items-center justify-center text-xs font-mono text-sky-500">
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{name}</span>
                      <span className="block text-[10px] text-slate-500">刚刚上线</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

