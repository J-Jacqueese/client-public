import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronRight,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Filter,
  ChevronDown,
} from 'lucide-react';
import ModelCard from '../components/ModelCard';
import { modelAPI, baseModelAPI, commonAPI } from '../services/api';

export default function ModelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [baseModels, setBaseModels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '0');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBaseModels, setSelectedBaseModels] = useState([]);
  const [sortBy, setSortBy] = useState('downloads');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    industries: true,
    bases: true,
    tags: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    loadCategories();
    loadTags();
    loadBaseModels();
  }, []);

  useEffect(() => {
    loadModels();
  }, [selectedCategory, selectedTags, selectedBaseModels, sortBy, searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTags, selectedBaseModels, sortBy, searchParams]);

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(models.length / PAGE_SIZE));
    setCurrentPage((p) => Math.min(p, tp));
  }, [models.length]);

  const loadCategories = async () => {
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
              item.name.trim() !== ''
          )
        );
      } else {
        console.warn('Categories response data is not an array:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    }
  };

  const loadTags = async () => {
    try {
      const response = await commonAPI.getTags();
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setTags(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string') &&
              typeof item.name === 'string' &&
              item.name.trim() !== ''
          )
        );
      } else {
        console.warn('Tags response data is not an array:', data);
        setTags([]);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
      setTags([]);
    }
  };

  const loadBaseModels = async () => {
    try {
      const response = await baseModelAPI.getAll({ active_only: 'true' });
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setBaseModels(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string') &&
              typeof item.name === 'string' &&
              item.name.trim() !== '' &&
              typeof item.display_name === 'string' &&
              item.display_name.trim() !== ''
          )
        );
      } else {
        console.warn('Base models response data is not an array:', data);
        setBaseModels([]);
      }
    } catch (error) {
      console.error('Failed to load base models:', error);
      setBaseModels([]);
    }
  };

  const loadModels = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== '0' ? selectedCategory : undefined,
        sort: sortBy,
        search: (searchParams.get('search') || '') || undefined,
        base_models: selectedBaseModels.length > 0 ? selectedBaseModels : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };
      const response = await modelAPI.getAll(params);
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setModels(
          data.filter(
            (item) =>
              item &&
              (typeof item.id === 'number' || typeof item.id === 'string')
          )
        );
      } else {
        console.warn('Models response data is not an array:', data);
        setModels([]);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const next = new URLSearchParams(searchParams);
    if (categoryId !== '0') {
      next.set('category', categoryId);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleBaseModelToggle = (baseModel) => {
    setSelectedBaseModels(prev => 
      prev.includes(baseModel) 
        ? prev.filter(b => b !== baseModel)
        : [...prev, baseModel]
    );
  };

  const handleTagToggle = (tagName) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('search', value);
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleClear = () => {
    setSearchTerm('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  const activeFilterCount = selectedTags.length + selectedBaseModels.length + (selectedCategory !== '0' ? 1 : 0);

  const totalPages = Math.max(1, Math.ceil(models.length / PAGE_SIZE));
  const paginatedModels = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return models.slice(start, start + PAGE_SIZE);
  }, [models, currentPage]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === '0') return '';
    const target = categories.find((c) => String(c.id) === String(selectedCategory));
    return target?.name || '';
  }, [categories, selectedCategory]);

  const industryOptions = useMemo(
    () => [{ id: '0', name: '全部' }, ...categories.map((c) => ({ id: String(c.id), name: c.name }))],
    [categories],
  );

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedBaseModels([]);
    handleCategoryChange('0');
  };

  const sortOptions = [
    { key: 'downloads', label: '下载数' },
    { key: 'latest', label: '最新发布' },
    { key: 'likes', label: '点赞数' },
  ];

  const FilterSection = ({ title, expanded, onToggle, children }) => (
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-slate-800 mb-3 hover:text-blue-600 transition-colors"
      >
        {title}
        {expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {expanded && children}
    </div>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-slate-900 text-sm">筛选条件</h3>
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-blue-500 hover:text-blue-600 transition-colors">
            清除全部 ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection
        title="应用场景"
        expanded={expandedSections.industries}
        onToggle={() => setExpandedSections((s) => ({ ...s, industries: !s.industries }))}
      >
        <div className="flex flex-wrap gap-1.5">
          {industryOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCategoryChange(item.id)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedCategory === item.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="模型基座"
        expanded={expandedSections.bases}
        onToggle={() => setExpandedSections((s) => ({ ...s, bases: !s.bases }))}
      >
        <div className="flex flex-wrap gap-1.5">
          {baseModels?.map?.((baseModel) => (
            <button
              key={baseModel.id}
              onClick={() => handleBaseModelToggle(baseModel.name)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedBaseModels.includes(baseModel.name)
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'
              }`}
            >
              {baseModel.display_name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="主要标签"
        expanded={expandedSections.tags}
        onToggle={() => setExpandedSections((s) => ({ ...s, tags: !s.tags }))}
      >
        <div className="flex flex-wrap gap-1.5">
          {tags?.map?.((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.name)}
              className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedTags.includes(tag.name)
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-b from-blue-50/80 to-transparent py-10">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">模型库</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            模型库 <span className="text-gradient-ocean">Model Library</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl">
            汇聚 DeepSeek 全系列模型及社区微调版本，覆盖 NLP、视觉、代码、数学等多个领域
          </p>
        </div>
      </div>

      <div className="container pb-16">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <SidebarContent />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索模型名称、标签..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="清除搜索"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-blue-300 transition-all"
              >
                <Filter className="w-4 h-4" />
                筛选
                {activeFilterCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </button>

              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      sortBy === opt.key ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white rounded-xl border border-slate-100 p-5 mb-6 shadow-sm"
              >
                <SidebarContent />
              </motion.div>
            )}

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-slate-500">已选：</span>
                {selectedCategoryName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg border border-blue-100">
                    {selectedCategoryName}
                    <button onClick={() => handleCategoryChange('0')} className="hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBaseModels.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg border border-blue-100">
                    {item}
                    <button onClick={() => handleBaseModelToggle(item)} className="hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedTags.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg border border-blue-100">
                    {item}
                    <button onClick={() => handleTagToggle(item)} className="hover:text-blue-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm text-slate-500 mb-4">
              共找到 <span className="font-semibold text-slate-800">{models.length}</span> 个模型
              {models.length > 0 && (
                <span className="text-slate-400 ml-2">
                  （第 {currentPage}/{totalPages} 页，每页 {PAGE_SIZE} 个）
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="text-slate-400">加载中...</div>
              </div>
            ) : models.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-slate-400">暂无模型数据</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
                    >
                      上一页
                    </button>
                    <span className="text-sm text-slate-500 px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
