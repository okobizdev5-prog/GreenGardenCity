"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Search,
  X,
  Star,
  Sparkles,
  Calendar
} from "lucide-react";
import { 
  getBlogPostsAction, 
  createBlogPostAction, 
  deleteBlogPostAction 
} from "@/app/actions/blogActions";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  imageUrl: string | null;
  featured: boolean;
  specialCard: boolean;
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sustainability");
  const [summary, setSummary] = useState("");
  const [featured, setFeatured] = useState(false);
  const [specialCard, setSpecialCard] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const fetchPosts = async () => {
    const res = await getBlogPostsAction();
    if (res.success && res.data) {
      setPosts(res.data as BlogPost[]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }
    }

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const res = await createBlogPostAction({
      title,
      category,
      date: formattedDate,
      summary,
      imageUrl,
      featured,
      specialCard,
    });

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      fetchPosts();
    } else {
      alert(res.error || "Failed to create blog post.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const res = await deleteBlogPostAction(id);
      if (res.success) fetchPosts();
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("Sustainability");
    setSummary("");
    setFeatured(false);
    setSpecialCard(false);
    setFile(null);
  };

  const filteredPosts = posts.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Blog Insights Editor</h2>
          <p className="text-gray-500 text-sm">Write, edit, and publish newsletters and project updates.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95 shadow-sm"
        >
          <Plus className="h-5 w-5" /> Write Post
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Search controls */}
        <div className="p-5 border-b border-gray-100 flex items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search posts by title or category..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Cover</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Article Title</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Category</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Badges</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 w-24">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="h-10 w-16 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="h-10 w-16 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-150">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <p className="font-bold text-gray-950 text-sm">{post.title}</p>
                    <p className="text-xxs text-gray-400 mt-1 line-clamp-1 max-w-[300px]" title={post.summary}>
                      {post.summary}
                    </p>
                  </td>
                  <td className="p-4 align-middle text-sm">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md">
                      <Tag className="h-3 w-3" /> {post.category}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      {post.date}
                    </span>
                  </td>
                  <td className="p-4 align-middle space-x-1.5">
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xxs font-bold px-2 py-0.5 rounded-full border border-amber-200/50">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Featured
                      </span>
                    )}
                    {post.specialCard && (
                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xxs font-bold px-2 py-0.5 rounded-full border border-purple-200/50">
                        <Sparkles className="h-3 w-3 text-purple-600" /> Green Banner
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition"
                      title="Delete Post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No articles found. Click "Write Post" to publish.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-700"></div>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Write New Blog Post</h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish new stories and press releases.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. Master Plan Overview"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                >
                  <option value="Sustainability">Sustainability</option>
                  <option value="Community">Community</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Summary / Content Preview</label>
                <textarea 
                  required 
                  value={summary} 
                  onChange={e => setSummary(e.target.value)} 
                  rows={4}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700 resize-none" 
                  placeholder="Provide a brief introductory summary..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={featured} 
                    onChange={e => setFeatured(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
                  />
                  <span className="text-xs font-bold text-gray-600 uppercase">Featured Post</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={specialCard} 
                    onChange={e => setSpecialCard(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-500"
                  />
                  <span className="text-xs font-bold text-gray-600 uppercase">Green Banner Style</span>
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Article Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files?.[0] || null)} 
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); resetForm(); }} 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
