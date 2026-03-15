import { Link } from 'react-router-dom';
import { Heart, Users, TrendingUp, Globe, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppCard({ app, rank }) {
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    // 检查是否已经点赞过
    const upvotedApps = JSON.parse(localStorage.getItem('upvotedApps') || '[]');
    setHasUpvoted(upvotedApps.includes(String(app.id)));
  }, [app.id]);

  return (
    <Link
      to={`/apps/${app.id}`}
      className="block bg-white rounded-xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group"
    >
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
          {app.icon_bg || app.avatar ? (
            <img src={app.icon_bg || app.avatar} alt={app.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
              {app.name?.[0] || 'A'}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                {rank ? `${rank}. ` : ''}
                {app.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{app.developer || app.author || 'Unknown'}</span>
                {app.category_name && (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[10px]">{app.category_name}</span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => e.preventDefault()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                hasUpvoted
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-rose-200 hover:text-rose-500'
              }`}
              disabled={hasUpvoted}
            >
              <Heart className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-rose-500' : ''}`} />
              {(app.upvotes || 0).toLocaleString()}
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-3 line-clamp-1">{app.description || '暂无描述'}</p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {(app.views || 0).toLocaleString()} 浏览
            </span>
            <span className="flex items-center gap-1 text-emerald-500">
              <TrendingUp className="w-3 h-3" />
              +{Math.min(99, (app.upvotes || 0) % 50)}%
            </span>
            {app.website_url && (
              <a
                href={app.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Globe className="w-3 h-3" />
                官网
              </a>
            )}
            {app.download_url && (
              <a
                href={app.download_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Download className="w-3 h-3" />
                下载
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
