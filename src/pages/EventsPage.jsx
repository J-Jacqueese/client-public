import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  CalendarDays,
  Globe,
  Monitor,
  Building,
  X,
} from 'lucide-react';
import { eventAPI, resolvePublicUrl } from '../services/api';
import { showGlobalToast } from '../components/GlobalToast';
import EventCalendar from '../components/EventCalendar';
import {
  EVENT_TYPES_META,
  EVENT_MODES_META,
  EVENT_STATUSES_META,
  EVENT_CITIES_META,
  getStatusLabel,
  getStatusColor,
  getTypeLabel,
  getTypeIcon,
  getModeLabel,
  getCityLabel,
  pickUpcomingEvents,
} from '../lib/eventLabels';

function formatDateRange(start, end) {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d) => `${d.getMonth() + 1}月${d.getDate()}日`;
  if (s.toDateString() === e.toDateString()) return fmt(s);
  return `${fmt(s)} - ${fmt(e)}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function safeLocalList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function getModeIcon(mode) {
  if (mode === 'online') return <Monitor className="w-3.5 h-3.5" />;
  if (mode === 'offline') return <Building className="w-3.5 h-3.5" />;
  return <Globe className="w-3.5 h-3.5" />;
}

function EventCard({ event, onLiked }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(event.likes || 0);

  useEffect(() => {
    const likedEvents = safeLocalList('likedEvents');
    setLiked(likedEvents.includes(String(event.id)));
    setLikes(event.likes || 0);
  }, [event.id, event.likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) return;
    try {
      await eventAPI.like(event.id);
      const likedEvents = safeLocalList('likedEvents');
      likedEvents.push(String(event.id));
      localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
      setLiked(true);
      setLikes((v) => v + 1);
      onLiked?.(event.id);
    } catch (err) {
      console.error(err);
      showGlobalToast('点赞失败', 'error');
    }
  };

  const priceStr = event.price || '免费';

  return (
    <div>
      <Link to={`/events/${event.id}`} className="block">
        <div className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 cursor-pointer h-full flex flex-col">
          <div className="relative h-44 overflow-hidden bg-slate-100">
            {event.cover_image ? (
              <img
                src={resolvePublicUrl(event.cover_image)}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Calendar className="w-10 h-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStatusColor(
                  event.event_status
                )}`}
              >
                {getStatusLabel(event.event_status)}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/90 text-slate-700 border border-white/50 backdrop-blur-sm">
                {getTypeIcon(event.event_type)} {getTypeLabel(event.event_type)}
              </span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full backdrop-blur-sm ${
                  priceStr === '免费' ? 'bg-emerald-500/90 text-white' : 'bg-white/90 text-slate-800'
                }`}
              >
                {priceStr}
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3
              className="font-bold text-slate-800 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 overflow-hidden break-words min-h-[2.75rem]"
              title={event.title}
            >
              {event.title}
            </h3>
            <p
              className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 overflow-hidden break-words min-h-[2.875rem]"
              title={event.desc?.trim() ? event.desc : undefined}
            >
              {event.desc?.trim() ? event.desc : '\u00a0'}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{formatDateRange(event.start_date, event.end_date)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs min-w-0">
                {getModeIcon(event.event_mode)}
                <span className="text-blue-400 flex-shrink-0">{getModeLabel(event.event_mode)}</span>
                <span className="mx-1 text-slate-300 flex-shrink-0">·</span>
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">
                  {event.location || (event.city === 'online' ? '线上' : getCityLabel(event.city))}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>{event.current_participants ?? 0} 人参与</span>
              </div>
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function UpcomingSidebar({ events }) {
  const upcoming = pickUpcomingEvents(events, 5);
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5">
      <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" />
        近期活动
      </h3>
      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400">暂无近期活动</p>
        ) : (
          upcoming.map((ev) => (
            <Link key={ev.id} to={`/events/${ev.id}`}>
              <div className="group flex gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                  {ev.cover_image ? (
                    <img src={resolvePublicUrl(ev.cover_image)} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                    {ev.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatShortDate(ev.start_date)} · {getModeLabel(ev.event_mode)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function StatsSidebar({ events }) {
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.event_status !== 'ended').length;
  const totalParticipants = events.reduce((sum, e) => sum + Number(e.current_participants || 0), 0);
  const k = totalParticipants >= 1000 ? `${(totalParticipants / 1000).toFixed(1)}K` : String(totalParticipants);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5">
      <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        活动数据
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '总活动数', value: totalEvents, color: 'text-blue-600' },
          { label: '进行中', value: activeEvents, color: 'text-emerald-600' },
          { label: '总参与人次', value: k, color: 'text-amber-600' },
          { label: '活动类型', value: EVENT_TYPES_META.length, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-50 rounded-lg p-3 text-center">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubmitEventCTA() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5">
      <h3 className="font-semibold text-slate-700 text-sm mb-2">发布你的活动</h3>
      <p className="text-slate-500 text-xs leading-relaxed mb-4">
        组织了 AI 相关活动？在深求社区发布，让更多开发者参与！
      </p>
      <Link
        to="/events/submit"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors border border-blue-100"
      >
        提交活动
        <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [mode, setMode] = useState('all');
  const [status, setStatus] = useState('all');
  const [city, setCity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          type: type !== 'all' ? type : undefined,
          mode: mode !== 'all' ? mode : undefined,
          status: status !== 'all' ? status : undefined,
          city: city !== 'all' ? city : undefined,
          sort: 'start_asc',
        };
        const resp = await eventAPI.getAll(params);
        setEvents(resp.data.data || []);
      } catch (err) {
        console.error(err);
        showGlobalToast('加载活动失败', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, type, mode, status, city]);

  const hasActiveFilters =
    type !== 'all' || mode !== 'all' || status !== 'all' || city !== 'all' || Boolean(search.trim());

  const clearFilters = () => {
    setType('all');
    setMode('all');
    setStatus('all');
    setCity('all');
    setSearch('');
  };

  return (
    <div className="min-h-screen pt-16 pb-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        {/* Page Header */}
        <div className="mb-8 pt-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">AI 活动</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                AI 活动 <span className="text-gradient-ocean">Events</span>
              </h1>
              <p className="text-slate-600 text-sm max-w-xl">
                发现精彩的 AI 线上线下活动，讲座、黑客松、工作坊、技术分享，与全球开发者共同成长
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/events/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-600 rounded-lg text-sm font-medium border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                发布活动
              </Link>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  卡片
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  日历
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar — 对齐 deepseek-club EventsListPage：无横向滚动，lg 起横向排布 */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索活动名称、标签..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setType('all')}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  type === 'all'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                全部类型
              </button>
              {EVENT_TYPES_META.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    type === t.value
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all shrink-0 ${
                showFilters
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              筛选
            </button>
          </div>

          {showFilters ? (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <div>
                <span className="text-xs font-medium text-slate-500 mb-2 block">所在城市</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCity('all')}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      city === 'all'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    🌍 全部城市
                  </button>
                  {EVENT_CITIES_META.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCity(c.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        city === c.value
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 mb-2 block">活动形式</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMode('all')}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      mode === 'all'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    全部
                  </button>
                  {EVENT_MODES_META.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        mode === m.value
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 mb-2 block">活动状态</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus('all')}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      status === 'all'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    全部状态
                  </button>
                  {EVENT_STATUSES_META.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatus(s.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        status === s.value
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {hasActiveFilters ? (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">当前筛选：</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {loading ? '…' : `${events.length} 个活动`}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-0.5 ml-auto transition-colors"
              >
                <X className="w-3 h-3" />
                清除筛选
              </button>
            </div>
          ) : null}
        </div>

        {/* Main + Sidebar */}
        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-400">加载中...</div>
            ) : viewMode === 'list' ? (
              events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {events.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-2">暂无匹配的活动</h3>
                  <p className="text-sm text-slate-500 mb-4">尝试调整筛选条件或搜索关键词</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    清除所有筛选
                  </button>
                </div>
              )
            ) : (
              <EventCalendar events={events} />
            )}
          </div>

          <div className="hidden lg:block w-72 flex-shrink-0 space-y-5">
            <UpcomingSidebar events={events} />
            <StatsSidebar events={events} />
            <SubmitEventCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
