import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  ChevronRight,
  Share2,
  CheckCircle,
  ExternalLink,
  User,
} from 'lucide-react';
import { eventAPI, resolvePublicUrl } from '../services/api';
import { showGlobalToast } from '../components/GlobalToast';
import { getCityLabel } from '../lib/eventLabels';

const EVENT_TYPES = {
  hackathon: '黑客松',
  lecture: '讲座',
  workshop: '工作坊',
  meetup: '线下聚会',
  conference: '大会',
  sharing: '技术分享',
  competition: '竞赛',
};
const EVENT_MODES = { online: '线上', offline: '线下', hybrid: '线上+线下' };
const EVENT_STATUSES = {
  registering: '报名中',
  upcoming: '即将开始',
  ongoing: '进行中',
  ended: '已结束',
};

function safeLocalList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function StatusBadge({ status }) {
  const label = EVENT_STATUSES[status] || status;
  const cls =
    status === 'ended'
      ? 'bg-slate-100 text-slate-500 border-slate-200'
      : status === 'ongoing'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : status === 'upcoming'
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${cls}`}>
      {label}
    </span>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const [showRegister, setShowRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    team_name: '',
    team_size: '',
    ticket_count: 1,
    notes: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await eventAPI.getById(id);
        setEvent(resp.data.data);
        const likedEvents = safeLocalList('likedEvents');
        setLiked(likedEvents.includes(String(id)));
      } catch (err) {
        console.error(err);
        showGlobalToast('加载活动详情失败', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const canRegister = useMemo(() => event && event.event_status !== 'ended', [event]);

  const handleLike = async () => {
    if (!event || liked) return;
    try {
      await eventAPI.like(event.id);
      const likedEvents = safeLocalList('likedEvents');
      likedEvents.push(String(event.id));
      localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
      setLiked(true);
      setEvent((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (err) {
      console.error(err);
      showGlobalToast('点赞失败', 'error');
    }
  };

  const handleRegisterSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      showGlobalToast('请填写姓名/邮箱/手机号', 'error');
      return;
    }
    try {
      const resp = await eventAPI.register(event.id, form);
      const next = resp.data.currentParticipants;
      setEvent((prev) => ({ ...prev, current_participants: next }));
      setShowRegister(false);
      showGlobalToast('报名成功', 'success');
    } catch (err) {
      console.error(err);
      showGlobalToast(err?.response?.data?.message || '报名失败', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">活动未找到</h2>
          <p className="text-slate-500 mb-6">该活动可能已被移除或链接无效</p>
          <Link to="/events">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              返回活动列表
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const title = event.title;
  const typeLabel = EVENT_TYPES[event.event_type] || event.event_type;
  const modeLabel = EVENT_MODES[event.event_mode] || event.event_mode;
  const statusLabel = EVENT_STATUSES[event.event_status] || event.event_status;

  const cityLabel = getCityLabel(event.city) || event.city || '';

  return (
    <div className="min-h-screen pt-16 pb-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        <div className="mb-8 pt-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link to="/events" className="hover:text-blue-600 transition-colors">
              AI 活动
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-slate-800 font-medium truncate max-w-[min(100%,280px)]">{title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="space-y-6 min-w-0">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100">
                <div className="aspect-[2/1] max-h-[280px] w-full">
                  {event.cover_image ? (
                    <img
                      src={resolvePublicUrl(event.cover_image)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[160px] flex items-center justify-center text-slate-400 text-sm">
                      暂无封面图
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <StatusBadge status={event.event_status} />
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {typeLabel}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {modeLabel}
                  </span>
                  {cityLabel ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {cityLabel}
                    </span>
                  ) : null}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-4">{event.title}</h1>
                {Array.isArray(event.tags) && event.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {event.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">活动介绍</h2>
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
                    {event.full_desc || event.desc || ''}
                  </ReactMarkdown>
                </div>
              </div>

              {Array.isArray(event.highlights) && event.highlights.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">活动亮点</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {event.highlights.map((h, i) => (
                      <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100/50">
                        <div className="text-2xl mb-2">{['🏆', '⚡', '🎯', '🚀', '💡', '🎓', '🤝', '✨'][i % 8]}</div>
                        <p className="text-sm font-semibold text-slate-700">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {Array.isArray(event.agenda) && event.agenda.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">活动日程</h2>
                  <div className="space-y-3">
                    {event.agenda.map((item, i) => (
                      <div key={i} className="flex gap-4 min-w-0 items-stretch">
                        <div className="flex flex-col items-center flex-shrink-0 w-4">
                          <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-200 mt-1 flex-shrink-0" />
                          {i < event.agenda.length - 1 ? (
                            <div className="w-0.5 flex-1 min-h-[1rem] bg-blue-100 mt-2" />
                          ) : null}
                        </div>
                        <div className="pb-4 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {item.time}
                            </span>
                          </div>
                          <div className="font-medium text-slate-800 text-sm break-words">{item.title}</div>
                          {item.speaker ? (
                            <div className="text-xs text-slate-500 mt-1 flex items-start gap-1 break-words">
                              <User className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span>{item.speaker}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {Array.isArray(event.speakers) && event.speakers.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">嘉宾阵容</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.speakers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                          {String(s.name || '?').slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-sm truncate">{s.name}</div>
                          <div className="text-xs text-slate-500 truncate">
                            {s.title} · {s.company}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {Array.isArray(event.sponsors) && event.sponsors.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">合作伙伴</h2>
                  <div className="flex flex-wrap gap-3">
                    {event.sponsors.map((s, i) => (
                      <div key={i} className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </div>

            <aside className="space-y-5 lg:min-w-[320px]">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sticky top-28">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-slate-500">报名进度</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {event.current_participants}/{event.max_participants || '∞'} 人
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{
                      width:
                        event.max_participants > 0
                          ? `${Math.min(100, (Number(event.current_participants || 0) / Number(event.max_participants)) * 100)}%`
                          : '30%',
                    }}
                  />
                </div>
                {event.max_participants > 0 && event.current_participants / event.max_participants > 0.8 ? (
                  <p className="text-xs text-amber-600 mt-1">名额即将满员，抓紧报名！</p>
                ) : null}

                {canRegister ? (
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    {event.event_status === 'registering' ? '立即报名' : '报名'}
                  </button>
                ) : (
                  <div className="w-full mt-4 flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium">
                    活动已结束
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      liked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
                    {event.likes || 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      showGlobalToast('链接已复制');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-medium hover:border-blue-200 hover:text-blue-500 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    分享
                  </button>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 space-y-3.5">
                  {/* 标签列收窄到约「主办方：」宽度；链接行用「链接：」避免撑开整列 */}
                  <div className="grid grid-cols-[1rem_4rem_1fr] gap-x-2 items-start text-sm leading-snug">
                    <Users className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 whitespace-nowrap pt-0.5">主办方：</span>
                    <span className="text-slate-800 font-medium min-w-0 break-words">{event.organizer}</span>
                  </div>
                  {event.online_url ? (
                    <div className="grid grid-cols-[1rem_4rem_1fr] gap-x-2 items-start text-sm leading-snug">
                      <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-500 whitespace-nowrap pt-0.5">链接：</span>
                      <a
                        href={event.online_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline min-w-0 pt-0.5 font-medium"
                        title={event.online_url}
                      >
                        点击打开
                      </a>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-[1rem_4rem_1fr] gap-x-2 items-start text-sm leading-snug">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 whitespace-nowrap pt-0.5">时间：</span>
                    <span className="text-slate-800 font-medium min-w-0 break-words">
                      {formatDate(event.start_date)} - {formatDate(event.end_date)}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1rem_4rem_1fr] gap-x-2 items-start text-sm leading-snug">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 whitespace-nowrap pt-0.5">地点：</span>
                    <span className="text-slate-800 font-medium min-w-0 break-words">{event.location || '线上'}</span>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>

      {showRegister ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowRegister(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">活动报名</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {event.title} · {event.price || '免费'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500"
              >
                关闭
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">姓名</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  placeholder="请输入姓名"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">邮箱</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">手机号</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="13800138000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">公司/学校（选填）</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="选填"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">角色（选填）</label>
                  <input
                    value={form.role}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="选填"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">购票/报名数量</label>
                  <input
                    type="number"
                    min={1}
                    value={form.ticket_count}
                    onChange={(e) => setForm((p) => ({ ...p, ticket_count: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">团队名称（选填）</label>
                  <input
                    value={form.team_name}
                    onChange={(e) => setForm((p) => ({ ...p, team_name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    placeholder="选填"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">备注（选填）</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 min-h-[92px]"
                  placeholder="如有特殊需求可填写"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleRegisterSubmit}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                确认报名
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

