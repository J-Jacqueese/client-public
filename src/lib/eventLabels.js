/**
 * AI 活动展示用标签/配色（与 deepseek-club 原型对齐）
 */

export const EVENT_TYPES_META = [
  { value: 'hackathon', label: '黑客松', icon: '⚡' },
  { value: 'lecture', label: '讲座', icon: '🎓' },
  { value: 'workshop', label: '工作坊', icon: '🔧' },
  { value: 'meetup', label: '线下聚会', icon: '🤝' },
  { value: 'conference', label: '大会', icon: '🏛️' },
  { value: 'sharing', label: '技术分享', icon: '💡' },
  { value: 'competition', label: '竞赛', icon: '🏆' },
];

export const EVENT_MODES_META = [
  { value: 'online', label: '线上' },
  { value: 'offline', label: '线下' },
  { value: 'hybrid', label: '线上+线下' },
];

export const EVENT_STATUSES_META = [
  { value: 'registering', label: '报名中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'ongoing', label: '进行中' },
  { value: 'ended', label: '已结束' },
];

export const EVENT_CITIES_META = [
  { value: 'beijing', label: '北京', icon: '🏣' },
  { value: 'shanghai', label: '上海', icon: '🌆' },
  { value: 'hangzhou', label: '杭州', icon: '🌿' },
  { value: 'shenzhen', label: '深圳', icon: '🌃' },
  { value: 'guangzhou', label: '广州', icon: '🌺' },
  { value: 'hongkong', label: '香港', icon: '🌇' },
  { value: 'online', label: '纯线上', icon: '💻' },
  { value: 'other', label: '其他城市', icon: '📍' },
];

export function getStatusLabel(status) {
  const map = {
    registering: '报名中',
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
  };
  return map[status] || status || '';
}

export function getStatusColor(status) {
  const map = {
    registering: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
    ended: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return map[status] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function getTypeLabel(type) {
  return EVENT_TYPES_META.find((t) => t.value === type)?.label || type;
}

export function getTypeIcon(type) {
  return EVENT_TYPES_META.find((t) => t.value === type)?.icon || '📅';
}

export function getModeLabel(mode) {
  const map = { online: '线上', offline: '线下', hybrid: '线上+线下' };
  return map[mode] || mode;
}

export function getCityLabel(city) {
  return EVENT_CITIES_META.find((c) => c.value === city)?.label || city;
}

export function getCityIcon(city) {
  return EVENT_CITIES_META.find((c) => c.value === city)?.icon || '📍';
}

/** 近期活动：未结束，按开始时间升序 */
export function pickUpcomingEvents(events, limit = 5) {
  if (!Array.isArray(events)) return [];
  return [...events]
    .filter((e) => e.event_status && e.event_status !== 'ended')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, limit);
}
