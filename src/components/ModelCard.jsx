import { Link } from 'react-router-dom';
import { Heart, Download, Star, Cpu } from 'lucide-react';

const MODEL_TYPE_META = {
  hot: {
    label: '热门',
    className: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  latest: {
    label: '最新',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  recommended: {
    label: '推荐',
    className: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  official: {
    label: '官方',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  热门: {
    label: '热门',
    className: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  最新: {
    label: '最新',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  推荐: {
    label: '推荐',
    className: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  官方: {
    label: '官方',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

export default function ModelCard({ model }) {
  const modelTypeMeta = MODEL_TYPE_META[model?.model_type];

  return (
    <Link
      to={`/models/${model.id}`}
      className="block bg-white rounded-xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group h-full"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Cpu className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div className="min-w-0">
            <h3 className="font-mono font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors truncate">
              {model.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              {model.base_model || 'DeepSeek'} · {model.param_size || 'N/A'}
            </span>
          </div>
        </div>
        {modelTypeMeta && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${modelTypeMeta.className}`}>
            {modelTypeMeta.label}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">{model.description || '暂无描述'}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {model.category_name && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            {model.category_name}
          </span>
        )}
        {(model.tags || []).slice(0, 3).map((tag) => (
          <span
            key={typeof tag === 'string' ? tag : tag?.name}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
          >
            {typeof tag === 'string' ? tag : tag?.name}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 pt-2.5 border-t border-slate-50">
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {model.downloads || 0}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400" />
          {(model.stars || 0).toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-rose-400" />
          {model.likes || 0}
        </span>
        <span className="ml-auto text-[10px] text-slate-400">
          {model.created_at ? new Date(model.created_at).toLocaleDateString('zh-CN') : ''}
        </span>
      </div>
    </Link>
  );
}
