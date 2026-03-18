import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Rocket, Sparkles, ArrowRight, Star, X } from 'lucide-react';
import AppCard from '../components/AppCard';
import { appAPI, commonAPI } from '../services/api';

export default function AppsPage() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('upvotes');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  useEffect(() => {
    loadApps();
    loadCategories();
  }, [sortBy]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const response = await appAPI.getAll({ sort: sortBy });
      setApps(response.data.data);
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await commonAPI.getCategories('app');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const getCategoryCounts = () => {
    const counts = {};
    apps.forEach((app) => {
      const catName = app.category_name || '其他';
      counts[catName] = (counts[catName] || 0) + 1;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const categoryTabs = ['全部', ...categories.map((c) => c.name)];

  const filteredApps = apps.filter((app) => {
    if (activeCategory !== '全部' && (app.category_name || '其他') !== activeCategory) return false;
    if (!searchTerm.trim()) return true;
    const keyword = searchTerm.toLowerCase();
    return (
      (app.name && app.name.toLowerCase().includes(keyword)) ||
      (app.description && app.description.toLowerCase().includes(keyword)) ||
      ((app.author || app.developer || '').toLowerCase().includes(keyword))
    );
  });

  const newApps = [...apps]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 4);

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-blue-50/80 to-transparent py-10">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">应用榜</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            应用榜 <span className="text-gradient-ocean">App Ranking</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl">发现基于DeepSeek等国内外开源模型构建的优秀AI应用，支持点赞投票</p>
        </div>
      </div>

      <div className="container pb-16">
        <div className="flex gap-6">
          <main className="flex-1 min-w-0">
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索应用名称、描述、作者..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {categoryTabs.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-4 w-fit">
              <button
                onClick={() => setSortBy('upvotes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'upvotes'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                今日热门
              </button>
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === 'latest'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                新上线
              </button>
            </div>

            <div className="text-sm text-slate-500 mb-4">
              共 <span className="font-semibold text-slate-800">{filteredApps.length}</span> 个应用
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-20">
                  <div className="text-slate-400">加载中...</div>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-slate-400">暂无应用数据</div>
                </div>
              ) : (
                filteredApps.map((app, index) => <AppCard key={app.id} app={app} rank={index + 1} />)
              )}
            </div>
          </main>

          <aside className="hidden lg:block w-72 shrink-0 space-y-5">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-5 h-5" />
                <h3 className="font-bold text-sm">创业者扶持计划</h3>
              </div>
              <p className="text-blue-100 text-xs leading-relaxed mb-4">
                面向基于 DeepSeek 模型构建应用的创业团队，提供算力补贴、技术指导、社区推广等全方位支持。
              </p>
              <ul className="space-y-2 mb-4">
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
              <a
                href="https://discuss.deepseek.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-all"
              >
                立即申请
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-slate-900 text-sm">新上线应用</h3>
              </div>
              <div className="space-y-2">
                {newApps.map((app) => (
                  <Link
                    key={app.id}
                    to={`/apps/${app.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50/50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                      {app.icon_bg || app.avatar ? (
                        <img src={app.icon_bg || app.avatar} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-bold">
                          {app.name?.[0] || 'A'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{app.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString('zh-CN').slice(5) : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">应用生态数据</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">总应用数</span>
                  <span className="text-sm font-bold text-slate-800">{apps.length}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">总分类数</span>
                  <span className="text-sm font-bold text-slate-800">{categories.length}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">本周热门</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {apps.filter((app) => (app.upvotes || 0) > 100).length}+
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">筛选结果</span>
                  <span className="text-sm font-bold text-slate-800">{filteredApps.length}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
