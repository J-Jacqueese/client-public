import {
  ArrowRight,
  Users,
  MessageCircle,
  Eye,
  Clock,
  Tag,
  Flame,
  BookOpen,
  Wrench,
  Lightbulb,
  GraduationCap,
  Cpu,
  FileText,
  Briefcase,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const DISCUSS_URL = 'https://discuss.deepseek.club/';

const categories = [
  {
    icon: Flame,
    label: '行业动态与观点',
    href: 'https://discuss.deepseek.club/c/17-category/17',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
  },
  {
    icon: Cpu,
    label: '模型与技术发布',
    href: 'https://discuss.deepseek.club/c/17-category/17',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: BookOpen,
    label: '研究论文解读',
    href: 'https://discuss.deepseek.club/c/19-category/19',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
  },
  {
    icon: Wrench,
    label: '大模型微调',
    href: 'https://discuss.deepseek.club/c/finetune/6',
    color: 'text-sky-600',
    bg: 'bg-sky-50 border-sky-200',
  },
  {
    icon: GraduationCap,
    label: '新手入门(Q&A)',
    href: 'https://discuss.deepseek.club/c/2-category/2',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  {
    icon: Lightbulb,
    label: 'AI应用案例',
    href: 'https://discuss.deepseek.club/c/2-category/2',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
  },
  {
    icon: FileText,
    label: '资源下载库',
    href: 'https://discuss.deepseek.club/c/16-category/16',
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-200',
  },
  {
    icon: Briefcase,
    label: '招聘 & 商业合作',
    href: 'https://discuss.deepseek.club/c/commercial/9',
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200',
  },
];

const hotTopics = [
  {
    title: 'DeepSeek V4 与姚顺雨混元新模型同台发布',
    category: '行业动态与观点',
    categoryColor: 'text-orange-600',
    replies: 5,
    views: 85,
    time: '41 分钟前',
    hot: true,
  },
  {
    title: 'OpenClaw 省钱神器！MemOS 插件让 token 消耗暴跌 72%',
    category: 'OpenClaw专区',
    categoryColor: 'text-rose-600',
    replies: 9,
    views: 665,
    time: '4 分钟前',
    hot: true,
  },
  {
    title: '手把手教你调用 DeepSeek-OCR：轻量高精度实战',
    category: '大模型微调',
    categoryColor: 'text-sky-600',
    replies: 10,
    views: 460,
    time: '42 分钟前',
    hot: false,
  },
  {
    title: '融资 8000 万美元!Video Rebirth 领跑 AI视频，Bach 模型剑指工业级基础设施',
    href: 'https://discuss.deepseek.club/t/topic/1094',
    category: 'AI应用案例',
    categoryColor: 'text-amber-600',
    replies: 0,
    views: 0,
    time: '刚刚',
    hot: true,
  },
  {
    title: '一年跌下神坛！DeepSeek 从国产大模型顶流掉队，困局何解？',
    href: 'https://discuss.deepseek.club/t/topic/1059',
    category: '行业动态与观点',
    categoryColor: 'text-orange-600',
    replies: 0,
    views: 0,
    time: '刚刚',
    hot: false,
  },
  {
    title: '新手也能学会的，手把手教你电脑部署DeepSeek，赶紧来学习吧。',
    href: 'https://discuss.deepseek.club/t/topic/374',
    category: '新手入门(Q&A)',
    categoryColor: 'text-emerald-600',
    replies: 0,
    views: 0,
    time: '刚刚',
    hot: false,
  },
  {
    title: '从 Kaggle 到生产：实战部署 DeepSeek 模型全流程',
    category: 'AI应用案例',
    categoryColor: 'text-amber-600',
    replies: 18,
    views: 1540,
    time: '5 小时前',
    hot: true,
  },
  {
    title: '大厂工程师分享：如何在企业内部安全落地大模型',
    category: '行业动态与观点',
    categoryColor: 'text-orange-600',
    replies: 11,
    views: 980,
    time: '6 小时前',
    hot: false,
  }
];

function buildTopicHref(topic) {
  if (topic.href) return topic.href;
  return `https://discuss.deepseek.club/search?q=${encodeURIComponent(topic.title)}`;
}

export default function CommunitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const displayTopics = hotTopics.slice(0, 6);

  return (
    <section id="community" className="relative py-8 section-alt" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                <Users className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-mono text-xs text-emerald-500/60 tracking-widest uppercase">
                Open Source Community
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              开源<span className="text-gradient-ocean">社区</span>动态
            </h2>
            <p className="text-slate-600 max-w-lg text-sm">
              汇聚全球开发者、研究者与创新者，推动开放协作与技术无界流动
            </p>
          </div>
          <a
            href={DISCUSS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
          >
            进入社区
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-10"
        >
          {categories.map((cat, index) => (
            <motion.a
              key={cat.label}
              href={cat.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.04, duration: 0.35 }}
              className={`flex items-center gap-2 p-3 rounded-xl border ${cat.bg} transition-all cursor-pointer group`}
            >
              <cat.icon className={`w-4 h-4 ${cat.color} shrink-0`} />
              <span className="text-xs text-slate-700 group-hover:text-slate-900 transition-colors truncate font-medium">
                {cat.label}
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-slate-900 text-sm">热门话题</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayTopics.map((topic, i) => (
              <motion.a
                key={topic.title}
                href={buildTopicHref(topic)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.35 }}
                className="group card-ocean rounded-xl p-4 flex gap-3"
              >
                <span
                  className={`font-mono font-bold text-lg leading-none mt-0.5 ${
                    i < 2 ? 'text-orange-500' : 'text-slate-400'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors mb-2 leading-relaxed">
                    {topic.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span className={topic.categoryColor}>{topic.category}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {topic.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {topic.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {topic.time}
                    </span>
                  </div>
                </div>

                {topic.hot && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200 font-medium h-fit shrink-0">
                    HOT
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

