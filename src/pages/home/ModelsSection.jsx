import { ArrowRight, Boxes, Download, Star, Cpu, Brain, Eye, MessageSquare, Code2, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { modelAPI, commonAPI } from '../../services/api';

export default function ModelsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState(null);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
    loadModels();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await commonAPI.getCategories('model');
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setCategories(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string') &&
              typeof item.name === 'string' &&
              item.name.trim() !== '',
          ),
        );
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load model categories:', error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadModels = async () => {
    setLoading(true);
    try {
      // 首页模型区默认按下载量排序，取前若干个
      const response = await modelAPI.getAll({ sort: 'downloads' });
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setModels(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string'),
          ),
        );
      } else {
        setModels([]);
      }
    } catch (error) {
      console.error('Failed to load models for homepage:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    models.forEach((model) => {
      const name = model.category_name || '其他';
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [models]);

  const iconPool = [Brain, Eye, MessageSquare, Code2, Zap, Cpu];

  const modelCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.slice(0, 6).map((cat, index) => ({
      id: cat.id,
      icon: iconPool[index % iconPool.length],
      label: cat.name,
      count: categoryCounts[cat.name] || 0,
    }));
  }, [categories, categoryCounts]);

  const featuredModels = useMemo(() => {
    let list = models;
    if (activeCategory) {
      list = list.filter((model) => (model.category_name || '其他') === activeCategory);
    }
    return list.slice(0, 6);
  }, [models, activeCategory]);

  return (
    <section id="models" className="relative py-8 section-alt" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                <Boxes className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-mono text-xs text-blue-500/60 tracking-widest uppercase">Model Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              行业细化<span className="text-gradient-ocean">模型库</span>
            </h2>
            <p className="text-slate-600 max-w-lg text-sm">
              汇聚 DeepSeek 全系列模型及社区微调版本，覆盖 NLP、视觉、代码、数学等多个领域
            </p>
          </div>
          <Link
            to="/models"
            className="group flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all whitespace-nowrap"
          >
            查看全部模型
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {loadingCategories ? (
            <span className="text-xs text-slate-400">加载分类中...</span>
          ) : modelCategories.length === 0 ? (
            <span className="text-xs text-slate-400">暂无分类数据</span>
          ) : (
            modelCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-sm transition-all ${
                  activeCategory === cat.label
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-xs font-mono opacity-60">{cat.count}</span>
              </button>
            ))
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center text-slate-400 text-sm py-6">模型加载中...</div>
          ) : featuredModels.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 text-sm py-6">暂无模型数据</div>
          ) : (
            featuredModels.map((model, index) => (
              <motion.a
                key={model.id}
                href={`#/models/${model.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 + index * 0.06, duration: 0.45 }}
                className="block card-ocean rounded-xl p-5 h-full"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="font-mono font-semibold text-slate-900 text-sm">{model.name}</h3>
                  </div>
                  {model.model_type && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border bg-blue-50 text-blue-600 border-blue-200">
                      {model.model_type}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">
                  {model.description || '暂无描述'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {model.category_name && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                      {model.category_name}
                    </span>
                  )}
                  {(Array.isArray(model.tags) ? model.tags : []).slice(0, 3).map((tag) => (
                    <span
                      key={typeof tag === 'string' ? tag : tag?.name}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                    >
                      {typeof tag === 'string' ? tag : tag?.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {(model.downloads || 0).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    {(model.stars || 0).toLocaleString()}
                  </span>
                </div>
              </motion.a>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-8"
        >
          <Link
            to="/models"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            查看全部模型
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

