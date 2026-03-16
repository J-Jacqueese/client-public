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
import { showGlobalToast } from '../components/GlobalToast';

export default function AppDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [copiedDownloadKey, setCopiedDownloadKey] = useState('');

  useEffect(() => {
    loadApp();
    const upvotedApps = JSON.parse(localStorage.getItem('upvotedApps') || '[]');
    setHasUpvoted(upvotedApps.includes(String(id)));
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

  const handleToggleUpvote = () => {
    const appId = String(id);
    const upvotedApps = JSON.parse(localStorage.getItem('upvotedApps') || '[]');
    const hasLiked = upvotedApps.includes(appId);

    if (hasLiked) {
      const next = upvotedApps.filter((savedId) => savedId !== appId);
      localStorage.setItem('upvotedApps', JSON.stringify(next));
      setHasUpvoted(false);
      return;
    }

    upvotedApps.push(appId);
    localStorage.setItem('upvotedApps', JSON.stringify(upvotedApps));
    setHasUpvoted(true);
  };

  const copyToClipboard = async (text) => {
    if (!text) return false;

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  };

  const handleCopyDownloadLink = async (url, key = 'primary') => {
    if (!url) return;

    try {
      const copied = await copyToClipboard(url);
      if (!copied) throw new Error('Copy command failed');

      setCopiedDownloadKey(key);
      showGlobalToast('下载地址已复制到剪切板', 'success');
      window.setTimeout(() => {
        setCopiedDownloadKey((prev) => (prev === key ? '' : prev));
      }, 1800);
    } catch (error) {
      console.error('Failed to copy download link:', error);
      showGlobalToast('复制失败，请手动复制链接', 'error');
    }
  };

  const displayUpvotes = Math.max(0, (app?.upvotes || 0) + (hasUpvoted ? 1 : 0));
  const downloadLinks = Array.isArray(app?.download_links) ? app.download_links.filter((link) => link?.url) : [];
  const primaryDownloadUrl = downloadLinks[0]?.url || app?.download_url || '';

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
                  <span className="font-semibold text-slate-800">{displayUpvotes.toLocaleString()}</span>
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
              {primaryDownloadUrl && (
                <button
                  type="button"
                  onClick={() => handleCopyDownloadLink(primaryDownloadUrl, 'primary')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <Download className="w-4 h-4" />
                  {copiedDownloadKey === 'primary' ? '已复制链接' : '下载应用'}
                </button>
              )}
              <button
                onClick={handleToggleUpvote}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  hasUpvoted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasUpvoted ? 'fill-rose-500' : ''}`} />
                {hasUpvoted ? '取消点赞' : '点赞支持'}
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
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'download'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Download className="w-4 h-4" />
            下载应用
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

        {activeTab === 'download' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">下载地址</h3>
            {downloadLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {downloadLinks.map((link, index) => (
                  <button
                    type="button"
                    key={`${link.type || 'download'}-${index}`}
                    onClick={() => handleCopyDownloadLink(link.url, `download-${index}`)}
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {copiedDownloadKey === `download-${index}` ? '已复制链接' : link.type || `下载地址 ${index + 1}`}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{link.url}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <p className="text-sm text-slate-500">暂未配置下载地址</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
