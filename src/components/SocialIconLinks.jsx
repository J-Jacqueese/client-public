import { Github, MessageSquare, Twitter } from 'lucide-react';

const DISCUSS_URL = 'https://discuss.deepseek.club/';
const GITHUB_URL = 'https://github.com/deepseek-ai';

const btnClass =
  'w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all';

/**
 * 导航栏与页脚共用的社交图标（样式与链接保持一致）
 */
export default function SocialIconLinks({ className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={btnClass} aria-label="GitHub">
        <Github className="w-4 h-4" />
      </a>
      <a href={DISCUSS_URL} target="_blank" rel="noopener noreferrer" className={btnClass} aria-label="开源社区">
        <MessageSquare className="w-4 h-4" />
      </a>
      <a href="#" className={btnClass} aria-label="Twitter">
        <Twitter className="w-4 h-4" />
      </a>
    </div>
  );
}

export { DISCUSS_URL, GITHUB_URL };
