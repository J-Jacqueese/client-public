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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { appAPI, commonAPI } from '../../services/api';

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
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadApps();
    loadCategories();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const response = await appAPI.getAll({ sort: 'upvotes' });
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setApps(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string'),
          ),
        );
      } else {
        setApps([]);
      }
    } catch (error) {
      console.error('Failed to load apps for homepage:', error);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await commonAPI.getCategories('app');
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load app categories for homepage:', error);
      setCategories([]);
    }
  };

  const filteredApps = useMemo(() => {
    if (!apps || apps.length === 0) return [];
    if (activeTab === '全部') return apps;
    return apps.filter((app) => (app.category_name || '其他') === activeTab);
  }, [apps, activeTab]);

  const hotApps = useMemo(
    () => {
      const top5 = filteredApps.slice(0, 5);
      const sixth = filteredApps[5];
      if (!sixth) return top5;

      const idx = top5.findIndex(
        (app) => String(app?.name || '').trim().toLowerCase() === 'stepclaw',
      );
      if (idx === -1) return top5;

      const next = [...top5];
      next.splice(idx + 1, 0, sixth);
      return next;
    },
    [filteredApps],
  );

  const newApps = useMemo(() => {
    if (!apps || apps.length === 0) return [];
    return [...apps]
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime(),
      )
      .slice(0, 3);
  }, [apps]);

  return (
    <section id="apps" className="relative py-8" ref={ref}>
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
          <Link
            to="/apps"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
          >
            查看完整榜单
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['全部', ...categories.map((c) => c.name)].map((cat) => (
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
            {loading ? (
              <div className="text-center text-slate-400 text-sm py-6">应用加载中...</div>
            ) : hotApps.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-6">暂无应用数据</div>
            ) : (
              hotApps.map((app, index) => {
                const upvotes = app.upvotes || 0;
                const trend = `+${Math.min(99, upvotes % 50)}%`;
                const rank = index + 1;
                const isHot = index < 2 || upvotes > 100;

                return (
                  <motion.a
                    key={app.id}
                    href={`#/apps/${app.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.25 + index * 0.07, duration: 0.45 }}
                    className="group flex items-center gap-4 p-4 rounded-xl card-ocean"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${getRankStyle(
                        rank,
                      )}`}
                    >
                      {rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {app.name}
                        </h3>
                        {isHot && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{app.description || '暂无描述'}</p>
                    </div>

                    <span className="hidden sm:block text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 shrink-0">
                      {app.category_name || '其他'}
                    </span>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <ThumbsUp className="w-3 h-3" />
                        {upvotes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-mono">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                      </span>
                    </div>

                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </motion.a>
                );
              })
            )}
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
                  <h3 className="font-bold text-white text-sm">创业生态扶持计划</h3>
                </div>
                <p className="text-sm text-blue-100/85 mb-4 leading-relaxed">
                  面向基于 DeepSeek 模型构建应用的创业团队，提供算力补贴、技术指导、社区推广等全方位支持。
                </p>
                <ul className="space-y-2.5 mb-4">
                  <li className="flex items-center gap-2 text-xs text-blue-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    最高 100 万 Token 算力补贴
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    专属技术支持通道
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    社区首页推荐位
                  </li>
                  <li className="flex items-center gap-2 text-xs text-blue-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    投资机构对接机会
                  </li>
                </ul>
                <Link
                  to="/apps"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                >
                  了解更多
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="card-ocean rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-sky-500" />
                <h3 className="font-semibold text-slate-900 text-sm">新上线应用</h3>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-xs text-slate-400">加载中...</div>
                ) : newApps.length === 0 ? (
                  <div className="text-xs text-slate-400">暂无数据</div>
                ) : (
                  newApps.map((app, i) => (
                    <a
                      key={app.id}
                      href={`#/apps/${app.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 flex items-center justify-center text-xs font-mono text-sky-500">
                        {i + 1}
                      </div>
                      <div>
                        <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                          {app.name}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {app.created_at
                            ? new Date(app.created_at).toLocaleDateString('zh-CN').slice(5)
                            : '刚刚上线'}
                        </span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

