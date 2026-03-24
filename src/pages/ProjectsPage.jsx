import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, GitFork, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { projectAPI } from '../services/api';
import { showGlobalToast } from '../components/GlobalToast';

const PROJECT_CATEGORIES = [
  { value: 'framework', label: 'AI 框架', icon: '🏗️' },
  { value: 'inference', label: '推理优化', icon: '⚡' },
  { value: 'data', label: '数据工具', icon: '📊' },
  { value: 'vector-db', label: '向量数据库', icon: '🗄️' },
  { value: 'rag', label: 'RAG 框架', icon: '🔗' },
  { value: 'eval', label: '评测工具', icon: '📐' },
  { value: 'mlops', label: 'MLOps', icon: '🔄' },
  { value: 'agent', label: 'Agent 框架', icon: '🤖' },
  { value: 'finetune', label: '微调工具', icon: '🎯' },
  { value: 'monitoring', label: '可观测性', icon: '📡' },
  { value: 'security', label: 'AI 安全', icon: '🛡️' },
];

const LANGUAGE_COLORS = {
  Python: '#3572A5',
  Rust: '#DEA584',
  TypeScript: '#3178C6',
  Go: '#00ADD8',
  'C++': '#F34B7D',
  C: '#555555',
};

function formatStars(n) {
  const num = Number(n || 0);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

function safeLocalList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function ProjectCard({ project, onLiked }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(project.likes || 0);

  useEffect(() => {
    const likedProjects = safeLocalList('likedProjects');
    setLiked(likedProjects.includes(String(project.id)));
    setLikes(project.likes || 0);
  }, [project.id, project.likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;
    try {
      await projectAPI.like(project.id);
      const likedProjects = safeLocalList('likedProjects');
      likedProjects.push(String(project.id));
      localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      setLiked(true);
      setLikes((v) => v + 1);
      onLiked?.(project.id);
    } catch (err) {
      console.error(err);
      showGlobalToast('点赞失败', 'error');
    }
  };

  const cat = PROJECT_CATEGORIES.find((c) => c.value === project.category);
  const icon = cat?.icon || '📦';
  const langColor = LANGUAGE_COLORS[project.language] || '#888';

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="group bg-white rounded-xl border border-slate-100 p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0">
            <span className="text-base">{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-semibold">{formatStars(project.stars)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1">{project.full_name}</p>
            <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                {project.language}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {formatStars(project.forks)}
              </span>
              {project.trend_stars_7d ? (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  +{formatStars(project.trend_stars_7d)}/周
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-3">
              <button
                type="button"
                onClick={handleLike}
                disabled={liked}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  liked ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-500'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                {likes}
              </button>
              <span className="text-[11px] text-slate-400">
                {project.is_editor_choice ? '编辑推荐' : project.is_weekly_pick ? '每周精选' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState('all');
  const [sort, setSort] = useState('stars');

  const languages = useMemo(() => ['all', 'Python', 'TypeScript', 'Go', 'Rust', 'C++'], []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          category: category !== 'all' ? category : undefined,
          language: language !== 'all' ? language : undefined,
          sort,
        };
        const resp = await projectAPI.getAll(params);
        setProjects(resp.data.data || []);
      } catch (err) {
        console.error(err);
        showGlobalToast('加载项目失败', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category, language, sort]);

  return (
    <div className="min-h-screen pt-16 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container">
        <div className="pt-10 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/">首页</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">项目库</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            项目库 <span className="text-gradient-ocean">Project Library</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            精选 GitHub 上优质的 AI 基础设施与工具生态项目。
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索项目名称、描述..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
              {[
                { key: 'stars', label: 'Stars' },
                { key: 'trending', label: '本周趋势' },
                { key: 'updated', label: '最近更新' },
                { key: 'forks', label: 'Forks' },
              ].map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setSort(o.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sort === o.key ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <Link
              to="/projects/submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              推荐项目
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200/80 p-5">
              <div className="font-bold text-slate-800 text-sm mb-3">技术分类</div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    category === 'all' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700'
                  }`}
                >
                  全部
                </button>
                {PROJECT_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      category === c.value
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700'
                    }`}
                  >
                    <span className="mr-2">{c.icon}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 p-5">
              <div className="font-bold text-slate-800 text-sm mb-3">编程语言</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    language === 'all' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700'
                  }`}
                >
                  全部
                </button>
                {languages
                  .filter((l) => l !== 'all')
                  .map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        language === l ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
              </div>
            </div>
          </aside>

          <main>
            <div className="text-sm text-slate-500 mb-4">
              共 <span className="font-semibold text-slate-800">{projects.length}</span> 个项目
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400">加载中...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <div className="text-lg font-semibold mb-2">没有找到匹配的项目</div>
                <div className="text-sm text-slate-400">试试其他关键词或分类</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

