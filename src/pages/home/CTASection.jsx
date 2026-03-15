import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-20" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 px-8 py-14 sm:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs text-white/90 font-medium">加入全球开发者社区</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              科技向善，仝创未来
            </h2>
            <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              无论你是 AI 研究者、开发者还是创业者，深求社区都是你探索 DeepSeek 生态的最佳起点。
              加入我们，一起共建全球最大的第三方 DeepSeek 开源生态社区。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://deepseek.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-7 py-3 bg-white text-blue-600 font-semibold rounded-xl transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 flex items-center gap-2 text-sm"
              >
                立即加入社区
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="http://dpsk.ai/#/models"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 border border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-all hover:bg-white/10 text-sm"
              >
                浏览模型库
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 sm:gap-8 text-xs text-blue-100/60">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                开源免费
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                社区驱动
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                全球协作
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

