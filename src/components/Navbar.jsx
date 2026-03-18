import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { label: '首页', href: '/' },
  { label: '模型库', href: '/models' },
  { label: '应用榜', href: '/apps' },
  { label: '开源社区', href: 'https://deepseek.club/', external: true },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-slate-900 font-black tracking-[-0.02em] text-lg sm:text-xl">
            深求社区
          </span>
          <span className="hidden sm:inline text-xs font-mono tracking-[0.14em] text-slate-400">
            DEEPSEEK.CLUB
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-sm font-medium tracking-[0.01em] text-slate-700 hover:text-blue-600 transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 rounded-full group-hover:w-2/3 transition-all duration-300" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-[0.01em] transition-colors group ${
                  isActive(link.href) ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'w-2/3' : 'w-0 group-hover:w-2/3'
                  }`}
                />
              </Link>
            ),
          )}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
            <Search className="w-4 h-4" />
          </button>
          <a
            href="https://deepseek.club/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-[13px] font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            登录
          </a>
          <a
            href="https://deepseek.club/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-[13px] font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20"
          >
            注册
          </a>
        </div>

        <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container py-3.5 flex flex-col gap-1.5">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <div className="flex gap-2 mt-2 px-4">
                <a
                  href="https://deepseek.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg"
                >
                  登录
                </a>
                <a
                  href="https://deepseek.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"
                >
                  注册
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
