/**
 * 活动月历视图（设计对齐 deepseek-club EventCalendar，数据字段用后端 snake_case）
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { getStatusColor, getStatusLabel, getTypeLabel, getModeLabel, getTypeIcon } from '../lib/eventLabels';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_NAMES = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

function dayKey(year, month, day) {
  return new Date(year, month, day).getTime();
}

export default function EventCalendar({ events = [] }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      if (!ev?.start_date || !ev?.end_date) return;
      const start = new Date(ev.start_date);
      const end = new Date(ev.end_date);
      const startNorm = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(currentYear, currentMonth, d);
        if (date >= startNorm && date <= endNorm) {
          if (!map[d]) map[d] = [];
          map[d].push(ev);
        }
      }
    });
    return map;
  }, [events, currentYear, currentMonth, daysInMonth]);

  const goToPrevMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    setSelectedDay(null);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const isToday = (day) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : [];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const totalEventsThisMonth = new Set(Object.values(eventsByDay).flat().map((e) => e.id)).size;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-800">
              {currentYear}年 {MONTH_NAMES[currentMonth]}
            </h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {totalEventsThisMonth} 个活动
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              今天
            </button>
            <button
              type="button"
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={wd}
              className={`py-2.5 text-center text-xs font-semibold ${
                i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        <div key={`${currentYear}-${currentMonth}`} className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dayEvents = day ? eventsByDay[day] || [] : [];
            const isSelected = day === selectedDay;
            const isTodayCell = day ? isToday(day) : false;

            return (
              <div
                key={i}
                role={day ? 'button' : undefined}
                tabIndex={day ? 0 : undefined}
                onClick={() => day && setSelectedDay(isSelected ? null : day)}
                onKeyDown={(e) => {
                  if (day && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedDay(isSelected ? null : day);
                  }
                }}
                className={`relative min-h-[80px] p-1.5 border-b border-r border-slate-50 transition-colors ${
                  day ? 'hover:bg-blue-50/30 cursor-pointer' : 'bg-slate-50/30'
                } ${isSelected ? 'bg-blue-50/50 ring-1 ring-blue-200 ring-inset' : ''}`}
              >
                {day ? (
                  <>
                    <div
                      className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                        isTodayCell
                          ? 'bg-blue-500 text-white'
                          : isSelected
                            ? 'text-blue-600 font-bold'
                            : i % 7 === 0 || i % 7 === 6
                              ? 'text-slate-400'
                              : 'text-slate-600'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium ${
                            ev.event_status === 'registering'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ev.event_status === 'ongoing'
                                ? 'bg-blue-100 text-blue-700'
                                : ev.event_status === 'ended'
                                  ? 'bg-slate-100 text-slate-500'
                                  : 'bg-amber-100 text-amber-700'
                          }`}
                          title={ev.title}
                        >
                          {getTypeIcon(ev.event_type)} {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] text-slate-400 px-1.5 font-medium">
                          +{dayEvents.length - 2} 更多
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && selectedEvents.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            {currentMonth + 1}月{selectedDay}日 · {selectedEvents.length} 个活动
          </h4>
          <div className="space-y-3">
            {selectedEvents.map((ev) => (
              <Link key={ev.id} to={`/events/${ev.id}`}>
                <div className="group flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    {ev.cover_image ? (
                      <img src={ev.cover_image} alt={ev.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">无图</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusColor(ev.event_status)}`}
                      >
                        {getStatusLabel(ev.event_status)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {getTypeLabel(ev.event_type)} · {getModeLabel(ev.event_mode)}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                      {ev.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{ev.location || '线上'}</span>
                      </span>
                      <span>{ev.current_participants ?? 0} 人参与</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {selectedDay && selectedEvents.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">
            {currentMonth + 1}月{selectedDay}日暂无活动安排
          </p>
        </div>
      ) : null}
    </div>
  );
}
