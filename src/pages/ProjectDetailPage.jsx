import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight,
  Star,
  GitFork,
  ExternalLink,
  TrendingUp,
  Calendar,
  Users,
  Code,
  BookOpen,
  Heart,
  Share2,
} from 'lucide-react';
import { projectAPI, resolvePublicUrl } from '../services/api';
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

function safeLocalList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function formatStars(n) {
  const num = Number(n || 0);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return String(num);
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await projectAPI.getById(id);
        const p = resp.data.data;
        setProject(p);
        const likedProjects = safeLocalList('likedProjects');
        setLiked(likedProjects.includes(String(p.id)));

        const resp2 = await projectAPI.getAll({
          category: p.category,
          sort: 'stars',
        });
        const list = resp2.data.data || [];
        setRelated(list.filter((x) => String(x.id) !== String(p.id)).slice(0, 3));
      } catch (err) {
        console.error(err);
        showGlobalToast('加载项目详情失败', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const cat = useMemo(() => PROJECT_CATEGORIES.find((c) => c.value === project?.category), [project]);
  const langColor = project ? LANGUAGE_COLORS[project.language] || '#888' : '#888';

  const handleLike = async () => {
    if (!project || liked) return;
    try {
      await projectAPI.like(project.id);
      const likedProjects = safeLocalList('likedProjects');
      likedProjects.push(String(project.id));
      localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      setLiked(true);
      setProject((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (err) {
      console.error(err);
      showGlobalToast('点赞失败', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">项目未找到</h2>
          <p className="text-sm text-slate-400 mb-6">该项目可能已被移除或链接无效</p>
          <Link to="/projects">
            <span className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              返回项目库
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container">
        <div className="pt-6 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <Link to="/">首页</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/projects">项目库</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-medium">{project.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-lg border border-slate-100">
                  {cat?.icon} {cat?.label}
                </span>
                {project.is_weekly_pick ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-lg border border-amber-100">
                    🔥 本周精选
                  </span>
                ) : null}
                {project.is_editor_choice ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg border border-blue-100">
                    ⭐ 编辑推荐
                  </span>
                ) : null}
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-lg border"
                  style={{
                    backgroundColor: `${langColor}10`,
                    color: langColor,
                    borderColor: `${langColor}30`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
                  {project.language}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{project.name}</h1>
              <p className="text-sm text-slate-400 mb-3">{project.full_name}</p>
              <p className="text-base text-slate-600 leading-relaxed mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </a>
                {project.website_url ? (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-medium hover:border-blue-200 hover:text-blue-600 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    官网
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={liked}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
                    liked ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-500 border-slate-200 hover:border-rose-200 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
                  {project.likes || 0}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(window.location.href);
                    showGlobalToast('链接已复制');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-500 border border-slate-200 rounded-xl text-sm hover:border-blue-200 hover:text-blue-500 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>

              {project.editor_comment ? (
                <div className="mt-6 bg-blue-50/40 border border-blue-100 rounded-xl p-4">
                  <div className="text-xs font-semibold text-blue-700 mb-1">编辑点评</div>
                  <div className="text-sm text-blue-800 italic leading-relaxed">"{project.editor_comment}"</div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-amber-50">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-lg font-bold text-slate-800">{formatStars(project.stars)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Stars</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-blue-50">
                  <GitFork className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-slate-800">{formatStars(project.forks)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Forks</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-emerald-50">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-lg font-bold text-slate-800">{project.contributors || 0}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">贡献者</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center bg-orange-50">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-lg font-bold text-slate-800">{formatStars(project.trend_stars_7d || 0)}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">本周新增</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                项目详情
              </h2>
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) =>
                      src ? (
                        <img
                          src={resolvePublicUrl(src)}
                          alt={alt || ''}
                          className="rounded-lg max-w-full h-auto my-3 border border-slate-100"
                        />
                      ) : null,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {project.long_description || project.description}
                </ReactMarkdown>
              </div>
            </div>

            {Array.isArray(project.topics) && project.topics.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-500" />
                  技术标签
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.topics.map((t) => (
                    <span key={t} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-100">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {related.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-violet-500" />
                  相关项目
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map((p) => (
                    <Link key={p.id} to={`/projects/${p.id}`} className="block">
                      <div className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-slate-800 truncate">{p.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">{p.full_name}</div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-semibold">{formatStars(p.stars)}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 mt-2 line-clamp-2">{p.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-700 text-sm mb-4">项目信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-400" />
                    许可证
                  </span>
                  <span className="font-medium text-slate-700">{project.license || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-400" />
                    语言
                  </span>
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                    {project.language}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    最近更新
                  </span>
                  <span className="font-medium text-slate-700">{project.last_update || '-'}</span>
                </div>
                {project.trend_stars_7d ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-slate-400" />
                      本周趋势
                    </span>
                    <span className="font-medium text-emerald-600">+{formatStars(project.trend_stars_7d)}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-700 mb-3">分类</div>
                {project.category ? (
                  <Link
                    to={`/projects?category=${encodeURIComponent(project.category)}`}
                    className="block px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all"
                  >
                    <span className="mr-2">{cat?.icon || '📦'}</span>
                    {cat?.label || project.category}
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  在 GitHub 上查看
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

