"use client";

import { useState, useEffect } from "react";
import {
  Check,
  MapPin,
  Search,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Compass,
  Home,
  ArrowUpDown
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  status?: string;
};

type ProjectsClientProps = {
  initialProjects: Project[];
};

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Inquiry");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMainCategory, setActiveMainCategory] = useState<"All" | "Land" | "Apartment">("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  // Helper to normalize and deduplicate category names (e.g. "Phase 2" -> "Land - Phase 2")
  const normalizeCatName = (cat: string) => {
    if (!cat) return "";
    const cleaned = cat.trim();
    if (/^phase\s*\d+/i.test(cleaned)) {
      const match = cleaned.match(/phase\s*(\d+)/i);
      if (match) return `Land - Phase ${match[1]}`;
    }
    return cleaned;
  };

  // Compute deduplicated dynamic land categories
  const dynamicLandCategories = Array.from(
    new Set(
      initialProjects
        .map((p) => normalizeCatName(p.category || "Land - Phase 1"))
        .filter(
          (cat) =>
            !cat.toLowerCase().includes("apartment") &&
            !cat.toLowerCase().includes("flat")
        )
    )
  );

  // Sync category status from URL parameter safely without de-optimizing SSG
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        const paramLower = categoryParam.toLowerCase();
        if (paramLower === "phase1" || paramLower === "phase 1") {
          setActiveMainCategory("Land");
          setActiveSubCategory("Land - Phase 1");
        } else if (paramLower === "phase2" || paramLower === "phase 2") {
          setActiveMainCategory("Land");
          setActiveSubCategory("Land - Phase 2");
        } else if (paramLower === "flatbuysell" || paramLower === "flat buy/sell" || paramLower.includes("apartment")) {
          setActiveMainCategory("Apartment");
        } else if (paramLower === "land") {
          setActiveMainCategory("Land");
          setActiveSubCategory("All");
        }
      }
    }
  }, []);

  const handleBookVisit = (projectTitle: string) => {
    setSelectedProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

  // Helper to safely strip HTML tags for search comparison
  const getPlainText = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  // Filter projects dynamically with normalized matching
  const filteredProjects = initialProjects.filter((project) => {
    const textSnippet = getPlainText(project.description).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      textSnippet.includes(query);

    const categoryLower = (project.category || "").toLowerCase();
    const isApartment = categoryLower.includes("apartment") || categoryLower.includes("flat");
    const isLand = !isApartment;

    let matchesCategory = true;
    if (activeMainCategory === "Apartment") {
      matchesCategory = isApartment;
    } else if (activeMainCategory === "Land") {
      matchesCategory = isLand;
    }

    let matchesSubCategory = true;
    if ((activeMainCategory === "Land" || activeMainCategory === "All") && activeSubCategory !== "All") {
      const normProjectCat = normalizeCatName(project.category || "").toLowerCase();
      const normActiveSub = normalizeCatName(activeSubCategory).toLowerCase();
      matchesSubCategory =
        normProjectCat === normActiveSub ||
        normProjectCat.includes(normActiveSub) ||
        normActiveSub.includes(normProjectCat);
    }

    let matchesStatus = true;
    if (statusFilter !== "All") {
      matchesStatus = (project.status || "").toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "oldest") {
      return (a.id || "").localeCompare(b.id || "");
    } else if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (sortBy === "category") {
      return (a.category || "").localeCompare(b.category || "");
    } else if (sortBy === "status") {
      return (a.status || "").localeCompare(b.status || "");
    }
    // Default: newest first
    return (b.id || "").localeCompare(a.id || "");
  });

  const subCategoryTabs = ["All", ...dynamicLandCategories];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => handleBookVisit("General Inquiry")} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-10">
        {/* Header */}
        <header className="space-y-4 max-w-3xl">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> Showcase Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
            Our Master Projects
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            Explore our curated residential masterplans, commercial spaces, and premium villa architectures in Green Garden City.
          </p>
        </header>

        {/* Category Navigation Bar & Sub-category Pills */}
        <div className="space-y-3">
          {/* Main Category Tabs - 100% Fit Responsive Segmented Control */}
          <div className="grid grid-cols-3 bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200 gap-1">
            <button
              onClick={() => {
                setActiveMainCategory("All");
                setActiveSubCategory("All");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${activeMainCategory === "All"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
                }`}
            >
              <Compass className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>All ({initialProjects.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveMainCategory("Land");
                setActiveSubCategory("All");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${activeMainCategory === "Land"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
                }`}
            >
              <Compass className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>Land</span>
            </button>
            <button
              onClick={() => {
                setActiveMainCategory("Apartment");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${activeMainCategory === "Apartment"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
                }`}
            >
              <Home className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>Apartments</span>
            </button>
          </div>

          {/* Deduplicated Subcategories for Land or All - Clean Wrap */}
          {(activeMainCategory === "Land" || activeMainCategory === "All") && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {subCategoryTabs.map((subTab) => {
                const isActive = activeSubCategory === subTab;
                return (
                  <button
                    key={subTab}
                    onClick={() => setActiveSubCategory(subTab)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${isActive
                        ? "bg-green-700 border-green-800 text-white shadow-xs"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                  >
                    {subTab === "All" ? "All Phases" : subTab}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Streamlined Search, Status & Sorting Control Bar */}
        <section className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-xs font-medium text-gray-700"
              placeholder="Search projects by title, amenities, keywords..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter & Sort Dropdowns Stack for 100% Mobile Fit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
            {/* Status Filter */}
            <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1">
              <span className="text-xxs font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1 px-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-right"
              >
                <option value="All">All Statuses</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <span className="text-xxs font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">SORT BY:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-right"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="category">Category</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || activeMainCategory !== "All" || activeSubCategory !== "All" || statusFilter !== "All" || sortBy !== "newest") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveMainCategory("All");
                  setActiveSubCategory("All");
                  setStatusFilter("All");
                  setSortBy("newest");
                }}
                className="text-xs font-bold text-green-700 hover:text-green-800 underline transition text-center py-1 whitespace-nowrap self-center sm:self-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Project Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProjects.map((project) => {
            const activeIdx = activeImageIndexes[project.id] || 0;
            const currentImg = project.images && project.images.length > 0 ? project.images[activeIdx] : null;
            const hasMultipleImages = project.images && project.images.length > 1;

            const prevSlide = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!project.images || project.images.length === 0) return;
              setActiveImageIndexes(prev => ({
                ...prev,
                [project.id]: (activeIdx - 1 + project.images.length) % project.images.length
              }));
            };

            const nextSlide = (e: React.MouseEvent) => {
              e.stopPropagation();
              if (!project.images || project.images.length === 0) return;
              setActiveImageIndexes(prev => ({
                ...prev,
                [project.id]: (activeIdx + 1) % project.images.length
              }));
            };

            return (
              <article
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Project Image Cover with Status & Category Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100 group/slider">
                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xxs font-extrabold uppercase tracking-wider shadow-sm border ${project.status === "Upcoming" ? "bg-amber-500 text-white border-amber-400" :
                      project.status === "Delivered" ? "bg-green-600 text-white border-green-500" :
                        "bg-blue-600 text-white border-blue-500"
                      }`}>
                      {project.status || "Ongoing"}
                    </span>

                    {/* Category Badge */}
                    {project.category && (
                      <span className="px-2.5 py-1 rounded-lg text-xxs font-extrabold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md shadow-sm">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <a href={`/projects/${project.id}`} className="block w-full h-full">
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt={project.title}
                        className="w-full h-full object-cover transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                  </a>

                  {/* Slider Arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      </button>

                      {/* Carousel Indicator Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-xs z-10">
                        {project.images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotIdx === activeIdx ? "bg-white scale-125" : "bg-white/50"
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <a href={`/projects/${project.id}`} className="hover:text-green-800 transition block">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-green-800">
                        {project.title}
                      </h3>
                    </a>

                    {/* Safe HTML rendering */}
                    <div
                      className="text-sm text-gray-600 line-clamp-5 prose prose-sm prose-green max-w-none leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a
                      href={`/projects/${project.id}`}
                      className="flex-1 bg-white hover:bg-gray-50 text-green-800 border border-green-200 font-semibold py-2.5 rounded-lg shadow-xs transition text-center text-xs flex items-center justify-center"
                    >
                      View Details
                    </a>
                    {project.status === "Delivered" || project.status === "Sold Out" ? (
                      <button
                        disabled
                        className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2.5 rounded-lg text-center text-xs cursor-not-allowed opacity-80"
                      >
                        SOLD OUT 🚫
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookVisit(project.title)}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg shadow-xs hover:shadow-md transition text-center text-xs"
                      >
                        Book Visit
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Empty Search Result State */}
        {filteredProjects.length === 0 && (
          <div className="p-16 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No projects found</h3>
            <p className="text-gray-500 text-sm">
              We couldn't find any development blueprints matching "{searchQuery}". Try searching for other terms like "villa", "square", or "residences".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
            >
              Clear Search Query
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
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

      {/* Booking scheduling modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlot={selectedProjectTitle}
      />
    </div>
  );
}
