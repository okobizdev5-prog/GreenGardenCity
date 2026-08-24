"use client";

import { useState } from "react";
import { Search, ArrowRight, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { Navbar } from "@/components/Navbar";

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

type BlogClientProps = {
  initialPosts: BlogPost[];
};

export function BlogClient({ initialPosts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Sustainability", "Community", "Architecture", "Lifestyle"];

  // Filter logic
  const filteredArticles = initialPosts.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-12">

        {/* Header & Filter Controls */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-sm font-bold text-green-700 uppercase tracking-widest">News & Updates</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
              Insights & Life
            </h1>
            <p className="text-gray-600 text-lg font-light leading-relaxed">
              Explore stories on sustainable urban living, modern architecture, and community life in Green Garden City.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-medium text-sm text-gray-700"
                placeholder="Search articles..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-full border transition ${selectedCategory === cat
                    ? "bg-green-700 text-white border-green-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid articles */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Featured Article */}
          {filteredArticles.filter(a => a.featured).map((article) => (
            <article
              key={article.id}
              className="md:col-span-8 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row group cursor-pointer"
            >
              <div className="lg:w-3/5 h-64 lg:h-auto relative overflow-hidden bg-gray-100">
                {article.imageUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    src={article.imageUrl}
                    alt={article.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Compass className="h-12 w-12" />
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <div className="p-8 lg:w-2/5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                    <span>{article.category}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    <span className="text-gray-400 font-medium">{article.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-800 transition leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-light">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center text-green-700 text-sm font-bold gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                  Read Article <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}

          {/* Special Banner Card */}
          {filteredArticles.filter(a => a.specialCard).map((article) => (
            <article
              key={article.id}
              className="md:col-span-4 bg-green-800 text-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-green-700/40 blur-xl"></div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-green-200">
                  <span>{article.category}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-amber-300 transition leading-snug">
                  {article.title}
                </h3>
                <p className="text-green-100 text-sm leading-relaxed font-light">
                  {article.summary}
                </p>
              </div>
              <div className="flex items-center text-amber-300 text-sm font-bold gap-1 pt-6">
                Read Details <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}

          {/* Standard cards */}
          {filteredArticles.filter(a => !a.featured && !a.specialCard).map((article) => (
            <article
              key={article.id}
              className="md:col-span-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
                {article.imageUrl ? (
                  <img
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    src={article.imageUrl}
                    alt={article.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Compass className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-700">
                    <span>{article.category}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300"></span>
                    <span className="text-gray-400 font-medium">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-light">
                    {article.summary}
                  </p>
                </div>
              </div>
            </article>
          ))}

        </section>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12 max-w-sm mx-auto space-y-3">
            <p className="text-gray-400 font-bold text-lg">No articles found</p>
            <p className="text-gray-500 text-sm">We couldn't find any articles matching your search query.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 pt-6">
          <button className="h-10 w-10 border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center transition disabled:opacity-40" disabled>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="h-10 w-10 bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center shadow-sm">1</button>
          <button className="h-10 w-10 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg flex items-center justify-center transition">2</button>
          <button className="h-10 w-10 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg flex items-center justify-center transition">3</button>
          <span className="text-gray-400 px-1">...</span>
          <button className="h-10 w-10 border border-gray-200 hover:bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900 mt-auto">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-12">
          <div className="text-xl font-bold text-white tracking-wide">Green Garden City</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            <a href="/contact" className="hover:text-amber-400 transition">Contact Us</a>
          </div>
          <div className="text-sm text-center md:text-right text-green-100/50">
            &copy; {new Date().getFullYear()} Green Garden City. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
