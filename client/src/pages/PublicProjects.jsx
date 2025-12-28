import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";

const pageSizes = [6, 12, 24];

const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("featured");

  const fetchProjects = async (opts = {}) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (featuredOnly) q.set('featured', 'true');
      if (selectedTags.length) q.set('tags', selectedTags.join(','));
      q.set('page', opts.page || page);
      q.set('limit', opts.limit || limit);
      q.set('sort', sort);
      const res = await axios.get('/projects?' + q.toString());
      const data = res.data?.data || [];
      setProjects(data);
      setTotal(res.data?.meta?.total || data.length);
      const allTags = new Set();
      (data || []).forEach(p => (p.tech || []).forEach(t => allTags.add(t)));
      setTags([...allTags]);
    } catch (err) {
      console.error('Failed fetch projects', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects({ page:1 }); }, []);

  const toggleTag = (t) => {
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);
  };

  const onSearch = () => { setPage(1); fetchProjects({ page:1 }); };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <SEOHead title="Projects - Portfolio" description="My projects" />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search projects..." className="border rounded px-3 py-2 flex-1" />
        <button onClick={onSearch} className="px-4 py-2 bg-indigo-600 text-white rounded">Search</button>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={featuredOnly} onChange={(e)=>{ setFeaturedOnly(e.target.checked); fetchProjects({page:1}); }} />
          Featured only
        </label>
        <select value={limit} onChange={(e)=>{ setLimit(parseInt(e.target.value)); fetchProjects({page:1, limit: parseInt(e.target.value)}); }} className="border rounded px-2 py-1">
          {pageSizes.map(s=> <option key={s} value={s}>{s} per page</option>)}
        </select>
        <select value={sort} onChange={(e)=>{ setSort(e.target.value); fetchProjects({page:1}); }} className="border rounded px-2 py-1">
          <option value="featured">Featured first</option>
          <option value="newest">Newest</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map(t => (
          <button key={t} onClick={()=>{ toggleTag(t); fetchProjects({page:1}); }} className={`px-3 py-1 rounded-full border ${selectedTags.includes(t) ? 'bg-indigo-600 text-white' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <p>Loading…</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div key={p._id || p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl shadow-lg p-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur">
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(p.tech || []).map((t)=> <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700">{t}</span>)}
              </div>
              <div className="flex gap-3">
                {/* === FIX IS HERE === */}
                {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">Live <ExternalLink size={16}/></a>}
                {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="text-gray-700 dark:text-gray-200 inline-flex items-center gap-1">Code <ExternalLink size={16}/></a>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div>Showing {projects.length} of {total}</div>
        <div className="flex gap-2">
          <button onClick={()=>{ if(page>1){ setPage(page-1); fetchProjects({page:page-1}); } }} className="px-3 py-1 border rounded" disabled={page <= 1}>Prev</button>
          <div className="px-3 py-1 border rounded">Page {page}</div>
          <button onClick={()=>{ setPage(page+1); fetchProjects({page:page+1}); }} className="px-3 py-1 border rounded" disabled={page * limit >= total}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default PublicProjects;