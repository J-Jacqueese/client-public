import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SocialIconLinks, { DISCUSS_URL } from './SocialIconLinks';
const DEEPSEEK_CLUB_LOGO =
  'https://discuss.deepseek.club/uploads/default/original/1X/6273b6258641ff27b15ee0a9585d524d0d774de5.png';

const footerLinks = [
  {
    title: '生态平台',
    links: [
      { label: '模型库', href: '#/models' },
      { label: '应用榜', href: '#/apps' },
      { label: '开源社区', href: DISCUSS_URL },
    ],
  },
  {
    title: '社区版块',
    links: [
      { label: '行业动态', href: 'https://discuss.deepseek.club/c/17-category/17' },
      { label: '模型发布', href: 'https://discuss.deepseek.club/c/11-category/11' },
      { label: '论文解读', href: 'https://discuss.deepseek.club/c/12-category/12' },
      { label: '新手入门', href: 'https://discuss.deepseek.club/c/2-category/2' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: 'DeepSeek 官方', href: 'https://www.deepseek.com/' },
      { label: 'API 文档', href: 'https://platform.deepseek.com/' },
      { label: 'GitHub', href: 'https://github.com/deepseek-ai' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <a href={DISCUSS_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img
                  src={DEEPSEEK_CLUB_LOGO}
                  alt="深求社区"
                  className="h-11 w-auto object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-sm">
              共建全球最大的第三方 DeepSeek 开源生态社区。科技向善，仝创未来！
            </p>
            <SocialIconLinks />
          </motion.div>

          {footerLinks.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: 0.05 * index }}
            >
              <h4 className="font-semibold text-slate-900 text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} 深求社区 DeepSeek.Club</p>
          <p className="text-xs text-slate-400 font-mono">Built with passion for open source</p>
        </div>
      </div>
    </footer>
  );
}
