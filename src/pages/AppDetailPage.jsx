import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ExternalLink,
  Download,
  TrendingUp,
  Users,
  ChevronRight,
  Globe,
  Share2,
  Star,
  Calendar,
  Rocket,
  MessageSquare,
} from 'lucide-react';
import { appAPI } from '../services/api';

export default function AppDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');

  useEffect(() => {
    loadApp();
    // 检查是否已经点赞过
    const upvotedApps = JSON.parse(localStorage.getItem('upvotedApps') || '[]');
    setHasUpvoted(upvotedApps.includes(id));
  }, [id]);

  const loadApp = async () => {
    setLoading(true);
    try {
      const response = await appAPI.getById(id);
      setApp(response.data.data);
    } catch (error) {
      console.error('Failed to load app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (hasUpvoted) {
      alert('您已经为这个应用点赞了');
      return;
    }
    
    try {
      await appAPI.upvote(id);
      setApp({ ...app, upvotes: (app.upvotes || 0) + 1 });
      
      // 保存到 localStorage
      const upvotedApps = JSON.parse(localStorage.getItem('upvotedApps') || '[]');
      upvotedApps.push(id);
      localStorage.setItem('upvotedApps', JSON.stringify(upvotedApps));
      setHasUpvoted(true);
    } catch (error) {
      console.error('Failed to upvote app:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">应用不存在</div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-blue-50/80 to-transparent">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
              首页
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('/apps')} className="hover:text-blue-600 transition-colors">
              应用榜
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">{app.name}</span>
          </div>
        </div>
      </div>

      <div className="container pb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-50">
                  {app.icon_bg || app.avatar ? (
                    <img src={app.icon_bg || app.avatar} alt={app.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-slate-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{app.name}</h1>
                  <p className="text-sm text-slate-600">{app.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {app.category_name && (
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-100">
                        {app.category_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="flex items-center gap-1.5">{app.developer || 'Unknown'}</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {app.created_at ? new Date(app.created_at).toLocaleDateString('zh-CN') : '未知日期'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {(app.views || 0).toLocaleString()} 浏览
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />+{Math.min(99, (app.upvotes || 0) % 50)}%
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Heart className={`w-4 h-4 ${hasUpvoted ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800">{(app.upvotes || 0).toLocaleString()}</span>
                  <span className="text-slate-400">点赞</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{(app.views || 0).toLocaleString()}</span>
                  <span className="text-slate-400">浏览</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-48 shrink-0">
              {app.website_url && (
                <a
                  href={app.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
                >
                  <Globe className="w-4 h-4" />
                  访问官网
                </a>
              )}
              {app.download_url && (
                <a
                  href={app.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <Download className="w-4 h-4" />
                  下载应用
                </a>
              )}
              <button
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  hasUpvoted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasUpvoted ? 'fill-rose-500' : ''}`} />
                {hasUpvoted ? '已点赞' : '点赞支持'}
              </button>
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all">
                <Share2 className="w-4 h-4" />
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-16">
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 p-1 mb-6 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('detail')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'detail' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Star className="w-4 h-4" />
            应用详情
          </button>
          <button
            onClick={() => setActiveTab('discuss')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'discuss'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            用户讨论
          </button>
        </div>

        {activeTab === 'detail' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{app.detail || app.description}</p>
              {app.comparison && (
                <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50 text-sm text-blue-900">
                  {app.comparison}
                </div>
              )}
            </div>
            {app.website_url && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">相关链接</h3>
                <a
                  href={app.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      官方网站
                    </div>
                    <div className="text-xs text-slate-500 truncate">{app.website_url}</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'discuss' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">用户讨论</h3>
              <a
                href="https://deepseek.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                前往社区讨论
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">加入社区讨论</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                前往深求社区参与关于 {app.name} 的讨论，分享使用经验和建议
              </p>
              <a
                href="https://deepseek.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-all shadow-sm"
              >
                前往社区
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
