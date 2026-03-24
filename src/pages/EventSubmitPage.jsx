import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin, Users, Shield, Send, ImagePlus, X } from 'lucide-react';
import { eventAPI } from '../services/api';
import { showGlobalToast } from '../components/GlobalToast';

const EVENT_TYPES = [
  { value: 'hackathon', label: '黑客松' },
  { value: 'lecture', label: '讲座' },
  { value: 'workshop', label: '工作坊' },
  { value: 'meetup', label: '线下聚会' },
  { value: 'conference', label: '大会' },
  { value: 'sharing', label: '技术分享' },
  { value: 'competition', label: '竞赛' },
];
const EVENT_MODES = [
  { value: 'online', label: '线上' },
  { value: 'offline', label: '线下' },
  { value: 'hybrid', label: '线上+线下' },
];
const EVENT_CITIES = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'guangzhou', label: '广州' },
  { value: 'hongkong', label: '香港' },
  { value: 'online', label: '纯线上' },
  { value: 'other', label: '其他城市' },
];

export default function EventSubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: '',
    mode: 'offline',
    city: '',
    desc: '',
    full_desc: '',
    cover_image: '',
    start_date: '',
    end_date: '',
    location: '',
    online_url: '',
    organizer: '',
    price: '',
    max_participants: '',
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
    if (!form.title.trim()) return showGlobalToast('请填写活动名称', 'error');
    if (!form.type) return showGlobalToast('请选择活动类型', 'error');
    if (!form.city) return showGlobalToast('请选择所在城市', 'error');
    if (!form.desc.trim()) return showGlobalToast('请填写活动简介', 'error');
    if (!form.full_desc.trim()) return showGlobalToast('请填写活动详情', 'error');
    if (!form.start_date || !form.end_date) return showGlobalToast('请填写活动日期', 'error');
    if (!form.organizer.trim()) return showGlobalToast('请填写主办方信息', 'error');
    if ((form.mode === 'offline' || form.mode === 'hybrid') && !form.location.trim()) {
      return showGlobalToast('线下活动请填写地点', 'error');
    }
    if ((form.mode === 'online' || form.mode === 'hybrid') && !form.online_url.trim() && form.mode !== 'offline') {
      // online_url 可选，但原型有；这里做较宽松校验
    }

    try {
      await eventAPI.submit({
        title: form.title.trim(),
        type: form.type,
        mode: form.mode,
        city: form.city,
        desc: form.desc.trim(),
        full_desc: form.full_desc.trim(),
        cover_image: form.cover_image.trim() || null,
        start_date: form.start_date,
        end_date: form.end_date,
        location: form.location.trim() || null,
        online_url: form.online_url.trim() || null,
        organizer: form.organizer.trim(),
        price: form.price.trim() || null,
        max_participants: form.max_participants === '' ? null : Number(form.max_participants),
        tags: form.tags,
        // 默认空数组：后续管理员可在后台编辑/完善
        speakers: [],
        agenda: [],
        highlights: [],
        sponsors: [],
        registration_url: null,
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
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5 border border-emerald-200">
              <Shield className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">提交成功</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              审核团队将在 1-3 个工作日内处理，届时通过后自动上线。
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/events">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                  返回活动列表
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    title: '',
                    type: '',
                    mode: 'offline',
                    city: '',
                    desc: '',
                    full_desc: '',
                    cover_image: '',
                    start_date: '',
                    end_date: '',
                    location: '',
                    online_url: '',
                    organizer: '',
                    price: '',
                    max_participants: '',
                    tags: [],
                    tagInput: '',
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-blue-600 bg-blue-50 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-100"
              >
                继续发布
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <div className="pt-6 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">首页</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/events">
              <span className="hover:text-blue-600 transition-colors cursor-pointer">AI 活动</span>
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600">发布活动</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-1">发布 AI 活动</h1>
          <p className="text-sm text-slate-500">填写基本信息即可提交，审核通过后自动上线</p>
        </div>

        <div className="bg-blue-50/60 rounded-xl border border-blue-100/80 px-4 py-2.5 mb-5 flex items-center gap-2.5">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <p className="text-xs text-slate-500">提交后进入人工审核（1-3 个工作日），通过后自动上线。</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">活动名称</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="例如：DeepSeek 模型微调实战工作坊"
                maxLength={60}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">活动类型</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">请选择</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">活动形式</label>
                <select
                  value={form.mode}
                  onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  {EVENT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">人数上限（留空不限）</label>
                <input
                  type="number"
                  value={form.max_participants}
                  onChange={(e) => setForm((p) => ({ ...p, max_participants: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="不限"
                  min={0}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">所在城市</label>
              <select
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">请选择城市</option>
                {EVENT_CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">活动简介</label>
              <input
                value={form.desc}
                onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="一句话描述活动"
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">活动详情（Markdown/文本）</label>
              <textarea
                value={form.full_desc}
                onChange={(e) => setForm((p) => ({ ...p, full_desc: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm min-h-[180px] focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="填写活动详情"
                maxLength={5000}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <ImagePlus className="w-4 h-4 text-slate-400" />
                详情页封面图 URL（选填）
              </label>
              <input
                value={form.cover_image}
                onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="https://xxx.jpg"
              />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              时间与地点
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">开始日期</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">结束日期</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {(form.mode === 'offline' || form.mode === 'hybrid') ? (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  活动地点
                </label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="例如：北京市海淀区中关村大街 1 号"
                />
              </div>
            ) : null}

            {(form.mode === 'online' || form.mode === 'hybrid') ? (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">线上链接（选填）</label>
                <input
                  value={form.online_url}
                  onChange={(e) => setForm((p) => ({ ...p, online_url: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="https://meeting.example.com/xxx"
                />
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                主办方
              </label>
              <input
                value={form.organizer}
                onChange={(e) => setForm((p) => ({ ...p, organizer: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="例如：深求社区"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">费用（选填，例如：免费 / ¥299）</label>
              <input
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                placeholder="免费 或 ¥299"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">活动标签（最多 5 个，逗号分隔）</label>
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
                  placeholder="例如：黑客松, 开源, AI 应用"
                />
                <button
                  type="button"
                  onClick={parseTags}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  添加
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
            <Link to="/events">
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
              提交审核
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

