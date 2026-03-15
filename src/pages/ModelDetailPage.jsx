import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Star,
  Heart,
  Calendar,
  User,
  ChevronRight,
  ExternalLink,
  Github,
  Cpu,
  Tag,
  Building2,
  FileText,
  MessageSquare,
  Share2,
  BookOpen,
} from 'lucide-react';
import { modelAPI } from '../services/api';

export default function ModelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [activeTab, setActiveTab] = useState('detail');
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    loadModel();
    // 检查是否已经点赞过
    const likedModels = JSON.parse(localStorage.getItem('likedModels') || '[]');
    setHasLiked(likedModels.includes(id));
  }, [id]);

  const loadModel = async () => {
    setLoading(true);
    try {
      const response = await modelAPI.getById(id);
      setModel(response.data.data);
    } catch (error) {
      console.error('Failed to load model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (hasLiked) {
      alert('您已经收藏过这个模型了');
      return;
    }
    
    try {
      await modelAPI.like(id);
      setModel({ ...model, likes: (model.likes || 0) + 1 });
      
      // 保存到 localStorage
      const likedModels = JSON.parse(localStorage.getItem('likedModels') || '[]');
      likedModels.push(id);
      localStorage.setItem('likedModels', JSON.stringify(likedModels));
      setHasLiked(true);
    } catch (error) {
      console.error('Failed to like model:', error);
    }
  };

  const handleDownload = async (link) => {
    try {
      await modelAPI.download(id);
      setModel({ ...model, downloads: (model.downloads || 0) + 1 });
      
      const linkType = link.type || '';
      const linkUrl = link.url || link;

      if (linkType && linkType !== '') {
        window.open(linkUrl, '_blank');
      } else {
        window.open(linkUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">模型不存在</div>
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
            <button onClick={() => navigate('/models')} className="hover:text-blue-600 transition-colors">
              模型库
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">{model.name}</span>
          </div>
        </div>
      </div>

      <div className="container pb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-mono">{model.name}</h1>
                  <p className="text-sm text-slate-500">{model.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {model.author || 'Unknown'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {model.created_at ? new Date(model.created_at).toLocaleDateString('zh-CN') : '未知日期'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {model.param_size || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {model.category_name || '通用'}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {model.license || 'MIT'}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{(model.downloads || 0).toLocaleString()}</span>
                  <span className="text-slate-400">下载</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-slate-800">{(model.stars || 0).toLocaleString()}</span>
                  <span className="text-slate-400">Stars</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Heart className={`w-4 h-4 ${hasLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-800">{(model.likes || 0).toLocaleString()}</span>
                  <span className="text-slate-400">点赞</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-48 shrink-0">
              {model.download_links && model.download_links.length > 0 ? (
                <button
                  onClick={() => handleDownload(model.download_links[0])}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
                >
                  <Github className="w-4 h-4" />
                  下载模型
                </button>
              ) : (
                <a
                  href="https://github.com/deepseek-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
                >
                  <Github className="w-4 h-4" />
                  GitHub 下载
                </a>
              )}
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  hasLiked
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
                {hasLiked ? '已点赞' : '点赞支持'}
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
            <FileText className="w-4 h-4" />
            模型详情
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'files' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Download className="w-4 h-4" />
            模型文件
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
            相关论坛
          </button>
        </div>

        {activeTab === 'detail' && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{model.readme || model.description || '暂无详细介绍'}</p>
              {model.prompt_example && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">推荐 Prompt</h3>
                  <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs text-blue-300">
                    <pre className="whitespace-pre-wrap">{model.prompt_example}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 text-xs font-bold text-slate-400 flex justify-between uppercase tracking-widest">
              <span>文件名</span>
              <div className="flex space-x-20">
                <span>大小</span>
                <span>下载</span>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {model.files && model.files.length > 0 ? (
                model.files.map((file, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 flex justify-between items-center text-sm font-mono hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-3 text-slate-300" /> {file.name}
                    </span>
                    <div className="flex space-x-12 items-center">
                      <span className="text-slate-400">{file.size}</span>
                      {model.download_links && model.download_links.length > 0 && (
                        <button onClick={() => handleDownload(model.download_links[0])} className="text-blue-600 hover:text-blue-700">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-400">暂无文件</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'discuss' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-sm">相关讨论</h3>
              <a
                href="https://deepseek.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                查看更多
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">加入社区讨论</h4>
              <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">前往深求社区参与关于 {model.name} 的讨论</p>
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
