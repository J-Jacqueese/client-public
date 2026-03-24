import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, Plus, X } from 'lucide-react';
import { projectAPI } from '../services/api';
import { showGlobalToast } from '../components/GlobalToast';

const PROJECT_CATEGORIES = [
  { value: 'framework', label: 'AI 框架' },
  { value: 'inference', label: '推理优化' },
  { value: 'data', label: '数据工具' },
  { value: 'vector-db', label: '向量数据库' },
  { value: 'rag', label: 'RAG 框架' },
  { value: 'eval', label: '评测工具' },
  { value: 'mlops', label: 'MLOps' },
  { value: 'agent', label: 'Agent 框架' },
  { value: 'finetune', label: '微调工具' },
  { value: 'monitoring', label: '可观测性' },
  { value: 'security', label: 'AI 安全' },
];

export default function ProjectSubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    github_url: '',
    category: '',
    reason: '',
    website_url: '',
    tags: [],
    tagInput: '',
  });

  const parseTags = () => {
    const raw = form.tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((p) => ({
      ...p,
      tags: Array.from(new Set([...p.tags, ...raw])).slice(0, 5),
      tagInput: '',
    }));
  };

  const handleSubmit = async () => {
    if (!form.github_url.trim()) return showGlobalToast('请填写 GitHub 仓库地址', 'error');
    if (!form.github_url.includes('github.com')) return showGlobalToast('请输入有效的 GitHub 仓库地址', 'error');
    if (!form.category) return showGlobalToast('请选择项目分类', 'error');
    if (!form.reason.trim()) return showGlobalToast('请填写推荐理由', 'error');

    try {
      await projectAPI.submit({
        github_url: form.github_url.trim(),
        category: form.category,
        reason: form.reason.trim(),
        website_url: form.website_url.trim() || null,
        tags: form.tags,
        // language 可选：暂不从 GitHub 自动抓取
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      showGlobalToast(err?.response?.data?.message || '提交失败', 'error');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">感谢推荐！</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            我们的编辑团队将在 1-3 个工作日内审核该项目。审核通过后将出现在项目库中。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/projects">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                返回项目库
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setForm({ github_url: '', category: '', reason: '', website_url: '', tags: [], tagInput: '' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-blue-600 bg-blue-50 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-100"
            >
              继续推荐
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="pt-6 pb-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
            <Link to="/">
              <span className="hover:text-blue-500 transition-colors cursor-pointer">首页</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/projects">
              <span className="hover:text-blue-500 transition-colors cursor-pointer">项目库</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 font-medium">推荐项目</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">推荐开源项目</h1>
          <p className="text-sm text-slate-500">
            发现了优质的 AI 相关开源项目？推荐给社区，让更多开发者受益
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="font-bold text-slate-800">推荐信息</div>
            <div className="text-sm text-slate-500 mt-1">提交后进入人工审核（1-3 个工作日）</div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">GitHub 仓库地址</label>
                <span className="text-rose-400 text-xs">*</span>
              </div>
              <input
                value={form.github_url}
                onChange={(e) => setForm((p) => ({ ...p, github_url: e.target.value }))}
                type="url"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="https://github.com/owner/repo"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">项目分类</label>
                <span className="text-rose-400 text-xs">*</span>
              </div>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">请选择分类</option>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">推荐理由</label>
                <span className="text-rose-400 text-xs">*</span>
              </div>
              <textarea
                value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm min-h-[120px] focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="简要说明该项目的亮点、创新之处或对 AI 生态的价值..."
                maxLength={500}
              />
              <div className="text-xs text-slate-400 mt-1 text-right">{form.reason.length}/500</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">项目官网</label>
                <span className="text-xs text-slate-400">选填</span>
              </div>
              <input
                value={form.website_url}
                onChange={(e) => setForm((p) => ({ ...p, website_url: e.target.value }))}
                type="url"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="https://project-website.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">标签（最多 5 个，逗号分隔）</label>
              </div>
              <div className="flex gap-2">
                <input
                  value={form.tagInput}
                  onChange={(e) => setForm((p) => ({ ...p, tagInput: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      parseTags();
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="例如：rag, agent, inference"
                />
                <button
                  type="button"
                  onClick={parseTags}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                    #{t}
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }))}
                      className="text-slate-400 hover:text-rose-500"
                      aria-label="删除标签"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/40">
            <Link to="/projects">
              <span className="text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                取消
              </span>
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              提交推荐
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

