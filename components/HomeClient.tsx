"use client";

import { useState, useEffect } from "react";
import {
  Trees,
  Compass,
  Road,
  ShieldCheck,
  Zap,
  Waves,
  Check,
  Landmark,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Sparkles,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  AlertCircle,
  Home
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

type BannerData = {
  id?: string;
  badgeText?: string;
  title?: string;
  highlightTitle?: string;
  subtitle?: string;
  bgImage?: string;
  highlights?: string[];
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
};

type HomeClientProps = {
  initialProjects: Project[];
  banner?: BannerData;
  banners?: BannerData[];
};

export function HomeClient({ initialProjects, banner, banners }: HomeClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Inquiry");
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Projects filter & sort states for Development Projects section
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [homeMainCategory, setHomeMainCategory] = useState<"All" | "Land" | "Apartment">("All");
  const [homeSubCategory, setHomeSubCategory] = useState<string>("All");
  const [homeStatusFilter, setHomeStatusFilter] = useState<string>("All");
  const [homeSortBy, setHomeSortBy] = useState<string>("newest");

  // Normalize banners list (fallback to banner or default if empty)
  const activeBanners: BannerData[] =
    banners && banners.length > 0
      ? banners
      : banner
        ? [banner]
        : [
          {
            badgeText: "100% GATED & SECURE ECO-CITY",
            title: "Discover the Future of",
            highlightTitle: "Urban Living",
            subtitle: "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Greenleaf Holdings Ltd..",
            bgImage: "/hero_background.png",
            highlights: [
              "Immediate Plot Registration",
              "Electricity & Gas Connections Ready",
              "15 Mins Drive from Hazrat Shahjalal Airport",
              "Flexible Installment Plans Available"
            ],
            primaryBtnText: "Book a Site Visit",
            primaryBtnLink: "#booking",
            secondaryBtnText: "Explore Plots",
            secondaryBtnLink: "#plots"
          }
        ];

  // Auto-play carousel slider every 6 seconds if multiple banners exist
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentSlideIndex] || activeBanners[0];

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

  // Dynamic deduplicated Land subcategories for Development Projects section
  const homeLandCategories = Array.from(
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

  const homeSubCategoryTabs = ["All", ...homeLandCategories];

  // Helper to safely strip HTML tags for search comparison
  const getPlainText = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  // Filter projects dynamically for homepage section
  const filteredHomeProjects = initialProjects.filter((project) => {
    const textSnippet = getPlainText(project.description).toLowerCase();
    const query = homeSearchQuery.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(query) || textSnippet.includes(query);

    const categoryLower = (project.category || "").toLowerCase();
    const isApartment = categoryLower.includes("apartment") || categoryLower.includes("flat");
    const isLand = !isApartment;

    let matchesMainCat = true;
    if (homeMainCategory === "Apartment") matchesMainCat = isApartment;
    else if (homeMainCategory === "Land") matchesMainCat = isLand;

    let matchesSubCat = true;
    if ((homeMainCategory === "Land" || homeMainCategory === "All") && homeSubCategory !== "All") {
      const normProjectCat = normalizeCatName(project.category || "").toLowerCase();
      const normActiveSub = normalizeCatName(homeSubCategory).toLowerCase();
      matchesSubCat =
        normProjectCat === normActiveSub ||
        normProjectCat.includes(normActiveSub) ||
        normActiveSub.includes(normProjectCat);
    }

    let matchesStatus = true;
    if (homeStatusFilter !== "All") {
      matchesStatus = (project.status || "").toLowerCase() === homeStatusFilter.toLowerCase();
    }

    return matchesSearch && matchesMainCat && matchesSubCat && matchesStatus;
  });

  // Sort filtered projects
  const sortedHomeProjects = [...filteredHomeProjects].sort((a, b) => {
    if (homeSortBy === "oldest") {
      return (a.id || "").localeCompare(b.id || "");
    } else if (homeSortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (homeSortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (homeSortBy === "category") {
      return (a.category || "").localeCompare(b.category || "");
    } else if (homeSortBy === "status") {
      return (a.status || "").localeCompare(b.status || "");
    }
    // Default: newest first
    return (b.id || "").localeCompare(a.id || "");
  });

  const handleBookVisit = (projectTitle: string = "General Inquiry") => {
    setSelectedProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

  const heroBg = currentBanner.bgImage || "/hero_background.png";
  const badgeText = currentBanner.badgeText || "100% GATED & SECURE ECO-CITY";
  const titleText = currentBanner.title || "Discover the Future of";
  const highlightTitleText = currentBanner.highlightTitle || "Urban Living";
  const subtitleText = currentBanner.subtitle || "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Greenleaf Holdings Ltd..";
  const highlightsList = currentBanner.highlights && currentBanner.highlights.length > 0 ? currentBanner.highlights : [
    "Immediate Plot Registration",
    "Electricity & Gas Connections Ready",
    "15 Mins Drive from Hazrat Shahjalal Airport",
    "Flexible Installment Plans Available"
  ];
  const primaryBtnText = currentBanner.primaryBtnText || "Book a Site Visit";
  const primaryBtnLink = currentBanner.primaryBtnLink || "#booking";
  const secondaryBtnText = currentBanner.secondaryBtnText || "Explore Plots";
  const secondaryBtnLink = currentBanner.secondaryBtnLink || "#plots";

  const amenities = [
    {
      title: "Gated Security",
      description: "24/7 security patrol, perimeter boundary walls, and smart access gates.",
      icon: ShieldCheck,
    },
    {
      title: "Eco Parks & Gardens",
      description: "Lush green zones, community parks, children's playground, and walking tracks.",
      icon: Trees,
    },
    {
      title: "Central Natural Lake",
      description: "A wide, beautiful lake with walking deck, sitting zones, and peaceful sunset views.",
      icon: Waves,
    },
    {
      title: "Internal Wide Roads",
      description: "Spacious internal road network ranging from 30ft to 40ft wide, neatly paved.",
      icon: Road,
    },
    {
      title: "Smart Utility Ready",
      description: "Complete underground power lines, running water supply, and modern sewage network.",
      icon: Zap,
    },
    {
      title: "Civic & Education Zone",
      description: "Earmarked zones for local schools, healthcare center, mosque, and shopping arcade.",
      icon: Landmark,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Sticky Header */}
      <Navbar onBookClick={() => handleBookVisit("Not Sure")} />

      {/* Hero Carousel Section */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out group"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        {/* Dark overlay with green tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-950/85 via-green-900/65 to-black/55 z-0 transition-opacity duration-700"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left transition-all duration-500 animate-in fade-in key={currentSlideIndex}">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-800/60 border border-green-700/50 backdrop-blur-md text-xs font-semibold tracking-wider text-green-200 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {badgeText}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {titleText} <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-amber-300">
                {highlightTitleText}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light leading-relaxed">
              {subtitleText}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => {
                  if (primaryBtnLink === "#booking" || primaryBtnLink.startsWith("#book")) {
                    handleBookVisit("Not Sure");
                  } else if (primaryBtnLink.startsWith("/")) {
                    window.location.href = primaryBtnLink;
                  } else if (primaryBtnLink.startsWith("#")) {
                    const el = document.querySelector(primaryBtnLink);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else handleBookVisit("Not Sure");
                  } else {
                    handleBookVisit("Not Sure");
                  }
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-green-900/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <CalendarDays className="h-5 w-5 text-green-200" />
                {primaryBtnText}
              </button>
              <a
                href={secondaryBtnLink}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold px-8 py-4 rounded-lg transition text-center flex items-center justify-center gap-2"
              >
                {secondaryBtnText}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Info Panel */}
          <div className="lg:col-span-4 lg:block transition-all duration-500 animate-in fade-in">
            <div className="glass-panel p-6 rounded-2xl border border-white/20 text-gray-900 shadow-2xl max-w-sm mx-auto space-y-6">
              <h3 className="text-lg font-bold text-green-900 border-b border-green-950/10 pb-3 flex items-center gap-2">
                <Compass className="h-5 w-5 text-green-700" /> Key Highlights
              </h3>
              <ul className="space-y-4 text-sm text-gray-700 font-medium">
                {highlightsList.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows (only if multiple banners exist) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 group-hover:opacity-100 active:scale-95 shadow-lg"
              title="Previous Slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition opacity-80 group-hover:opacity-100 active:scale-95 shadow-lg"
              title="Next Slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentSlideIndex
                      ? "w-8 bg-green-400"
                      : "w-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-sm font-bold text-green-700 uppercase tracking-widest">About Our Vision</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight leading-tight">
              A Glimpse into Sustainable Luxury
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Greenleaf Holdings Ltd. is carefully crafted to offer a highly secure, pollution-free, and natural living environment. Our community is designed with premium infrastructure and modern layouts, catering to families seeking luxury coupled with green surroundings.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every detail, from the layout of internal roads to the designated park spaces, has been designed by urban planners to guarantee a high quality of life and great long-term return on investment.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <h4 className="text-3xl font-extrabold text-green-700">100+</h4>
                <p className="text-sm text-gray-500 font-medium">Happy Plot Buyers</p>
              </div>
              <div>
                <h4 className="text-3xl font-extrabold text-green-700">40%</h4>
                <p className="text-sm text-gray-500 font-medium">Dedicated Greenery & Lakes</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-green-950/5">
              <img
                src="/vision_image.png"
                alt="Greenleaf Holdings Ltd. Vision"
                className="w-full object-cover aspect-video lg:aspect-[4/3] hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mb-16 space-y-4">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Designed for Convenience</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight">
            Premium Amenities
          </h2>
          <p className="text-gray-600">
            Enjoy an active and healthy lifestyle with modern urban facilities, parks, safety systems, and reliable infrastructure.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1 duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-6 group-hover:bg-green-700 group-hover:text-white transition duration-300">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-800 transition">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section id="plots" className="py-20 bg-gray-50 border-t border-gray-150">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mb-12 space-y-4">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Master Blueprints</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight">
            Development Projects
          </h2>
          <p className="text-gray-600">
            Explore our premium residential communities, smart commercial hubs, and green ecosystems. Plan your physical site visit today.
          </p>
        </div>

        {/* Category Navigation Bar & Sub-category Pills */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl mb-10 space-y-3">
          {/* Main Category Tabs - 100% Fit Responsive Segmented Control */}
          <div className="grid grid-cols-3 bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200 gap-1">
            <button
              onClick={() => {
                setHomeMainCategory("All");
                setHomeSubCategory("All");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                homeMainCategory === "All"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <Compass className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>All ({initialProjects.length})</span>
            </button>
            <button
              onClick={() => {
                setHomeMainCategory("Land");
                setHomeSubCategory("All");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                homeMainCategory === "Land"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <Compass className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>Land</span>
            </button>
            <button
              onClick={() => {
                setHomeMainCategory("Apartment");
              }}
              className={`py-2.5 px-1 sm:px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
                homeMainCategory === "Apartment"
                  ? "bg-white text-green-800 shadow-sm border border-gray-200/80"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              <Home className="h-4 w-4 shrink-0 text-green-700 hidden sm:block" />
              <span>Apartments</span>
            </button>
          </div>

          {/* Dynamic Sub-Category Pills - Clean Wrap */}
          {(homeMainCategory === "Land" || homeMainCategory === "All") && (
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-1.5 pt-1">
              {homeSubCategoryTabs.map((subTab) => {
                const isActive = homeSubCategory === subTab;
                return (
                  <button
                    key={subTab}
                    onClick={() => setHomeSubCategory(subTab)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                      isActive
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

          {/* Streamlined Search, Status & Sorting Control Bar */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={homeSearchQuery}
                onChange={e => setHomeSearchQuery(e.target.value)}
                placeholder="Search by title, location, keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
            </div>

            {/* Filter & Sort Dropdowns Stack for 100% Mobile Fit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
              {/* Status Filter */}
              <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1">
                <span className="text-xxs font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">STATUS:</span>
                <select
                  value={homeStatusFilter}
                  onChange={e => setHomeStatusFilter(e.target.value)}
                  className="py-1 px-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition text-right"
                >
                  <option value="All">All Statuses</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center justify-between gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 flex-1">
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                  <span className="text-xxs font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">SORT BY:</span>
                </div>
                <select
                  value={homeSortBy}
                  onChange={e => setHomeSortBy(e.target.value)}
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
              {(homeSearchQuery || homeMainCategory !== "All" || homeSubCategory !== "All" || homeStatusFilter !== "All" || homeSortBy !== "newest") && (
                <button
                  onClick={() => {
                    setHomeSearchQuery("");
                    setHomeMainCategory("All");
                    setHomeSubCategory("All");
                    setHomeStatusFilter("All");
                    setHomeSortBy("newest");
                  }}
                  className="text-xs font-bold text-green-700 hover:text-green-800 underline transition text-center py-1 whitespace-nowrap self-center sm:self-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedHomeProjects.map((project) => {
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
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Project Image Showcase with Carousel Controls */}
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

                  {/* Carousel Controls */}
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

                      {/* Dot indicators */}
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

                    {/* Rich HTML description snippet */}
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
              </div>
            );
          })}
        </div>

        {/* Empty State when no projects match filters */}
        {sortedHomeProjects.length === 0 && (
          <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-4 max-w-md mx-auto my-8 bg-white shadow-xs">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No matching projects found</h3>
            <p className="text-gray-500 text-xs">
              No development projects match your selected filters. Try resetting search or choosing another category or status.
            </p>
            <button
              onClick={() => {
                setHomeSearchQuery("");
                setHomeMainCategory("All");
                setHomeSubCategory("All");
                setHomeStatusFilter("All");
                setHomeSortBy("newest");
              }}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-lg text-xs transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* What You Get Section (গ্রীন গার্ডেন সিটি থেকে যা পাচ্ছেন) */}
      <section className="py-20 bg-gradient-to-b from-green-900 via-green-950 to-green-950 text-white relative overflow-hidden">
        {/* Subtle decorative background glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Exclusive Privileges
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              গ্রীন গার্ডেন সিটি থেকে যা পাচ্ছেন
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Why Greenleaf Holdings Ltd. is the most secure, high-value eco land project in Purbachal region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-5 group-hover:scale-110 transition">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white mb-2">এককালীন রেজিস্ট্রি</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                এককালীন মূল্য পরিশোধের সাথে সাথে সাফ-কবলা জমি রেজিস্ট্রি ও মিউটেশন সুবিধা।
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ডিজিটাল সিকিউরিটি</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                ২৪/৭ ডিজিটাল সিসিটিভি সার্ভেইল্যান্স, বাউন্ডারি ওয়াল এবং স্মার্ট সিকিউরিটি গেট।
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <Landmark className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">কেন্দ্রীয় জামে মসজিদ</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                প্রকল্পের ভেতরে আধুনিক স্থাপত্যে পরিকল্পিত নিজস্ব কেন্দ্রীয় জামে মসজিদ।
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <Trees className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">গ্রীন ইকো পার্ক ও লেক</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                সবুজ পরিবেশ, নান্দনিক প্রাকৃতিক লেক, বসার জোন এবং ওয়াকিং ট্র্যাক।
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">শিশুদের খেলার মাঠ</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                নিরাপদ ও সুপরিসর প্লেইং গ্রাউন্ড, স্পোর্টস জোন এবং বাচ্চাদের পার্ক।
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <Road className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">৩০-৪০ ফুট প্রশস্ত রাস্তা</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                প্রতিটি প্লটের সামনে ৩০, ৩৫ ও ৪০ ফুট প্রশস্ত কার্পেটিং অভ্যন্তরীণ রাস্তা।
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 hover:border-emerald-400/50 hover:bg-white/15 transition group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">দীর্ঘমেয়াদি সহজ কিস্তি</h3>
              <p className="text-gray-300 text-xs leading-relaxed font-light">
                ক্রেতাদের সুবিধার্থে দীর্ঘমেয়াদি সহজ সুদমুক্ত কিস্তিতে প্লট কেনার সুযোগ।
              </p>
            </div>

            {/* Feature 8 - Plot Sizes */}
            <div className="bg-gradient-to-tr from-emerald-600 to-green-700 p-6 rounded-2xl border border-emerald-400/40 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-amber-300 tracking-wider">AVAILABLE PLOTS</span>
                <h3 className="text-xl font-extrabold text-white mt-1 mb-3">৩, ৫ ও ১০ কাঠার প্লট</h3>
                <p className="text-white/90 text-xs leading-relaxed font-medium">
                  আপনার বাজেট ও প্রয়োজন অনুযায়ী রেডি প্লট বুকিং চলছে।
                </p>
              </div>
              <button
                onClick={() => handleBookVisit("Plot Size Inquiry")}
                className="mt-4 w-full bg-white hover:bg-amber-300 text-green-950 font-bold text-xs py-3 rounded-xl transition shadow-md"
              >
                বুকিং পরামর্শ চান &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Location & Step-by-step Route Breakdown */}
      <section id="location" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200">
              COMMUNICATION & ROUTE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 tracking-tight">
              সহজ যাতায়াত ও কৌশলগত অবস্থান
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">
              কুড়িল ফ্লাইওভার (৩০০ ফুট পূর্বাচল এক্সপ্রেসওয়ে) থেকে খুব সহজেই গ্রীন গার্ডেন সিটিতে পৌঁছানোর রুটম্যাপ।
            </p>
          </div>

          {/* Route Step-by-Step Distance Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between group hover:border-green-500 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                  START POINT
                </div>
                <h3 className="text-xl font-bold text-gray-900">Kuril Flyover</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  কুড়িল ৩০০ ফুট পূর্বাচল এক্সপ্রেসওয়ে থেকে যাত্রা শুরু।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>300 Ft Expressway</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between group hover:border-green-500 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  ⏱️ 20 MIN DRIVE
                </div>
                <h3 className="text-xl font-bold text-gray-900">Purbachal Club</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  ৩০০ ফুট সড়ক হয়ে ২০ মিনিটে পূর্বাচল ক্লাব ও সাধারণ বীমা পার হয়ে অগ্রসর হন।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Road className="h-4 w-4 text-green-600" />
                <span>Pass Purbachal Sports City</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-xs relative flex flex-col justify-between group hover:border-green-500 hover:shadow-md transition">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  ⏱️ 10 MIN DRIVE
                </div>
                <h3 className="text-xl font-bold text-gray-900">Sector 25</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  পূর্বাচল ক্লাব থেকে ১০ মিনিটে নীলা মার্কেট ও সেক্টর ২৫ পার হোন।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs font-semibold text-gray-500 flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-600" />
                <span>Pass Nilla Market & Sector 25</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 text-white rounded-2xl p-6 border border-green-700 shadow-lg relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-green-950 text-xs font-extrabold">
                  🎯 5 MIN DRIVE ➔ DESTINATION
                </div>
                <h3 className="text-xl font-extrabold text-white">Greenleaf Holdings Ltd.</h3>
                <p className="text-xs text-gray-200 leading-relaxed font-light">
                  সেক্টর ২৫ থেকে মাত্র ৫ মিনিটে পৌঁছে যান আপনার স্বপ্নের গ্রীন গার্ডেন সিটিতে (ঝিংগা পার্ক সংলগ্ন)।
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-green-700/50 text-xs font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Kaliganj, Gazipur (Purbachal)</span>
              </div>
            </div>
          </div>

          {/* Real Google Location Map & Key Investment Comparison Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-200">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-md bg-white flex flex-col">
                <div className="bg-green-950 text-white px-4 py-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold min-w-0">
                    <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="truncate">Real Map: Greenleaf Holdings Ltd., Kaliganj, Gazipur</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Kaliganj,Gazipur,Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xxs font-extrabold bg-amber-400 text-green-950 px-3 py-1 rounded-lg hover:bg-amber-300 transition whitespace-nowrap shrink-0"
                  >
                    Open Google Maps ↗
                  </a>
                </div>

                <div className="relative w-full h-[360px] sm:h-[420px]">
                  <iframe
                    title="Greenleaf Holdings Ltd. Real Location Map"
                    src="https://maps.google.com/maps?q=Kaliganj,%20Gazipur,%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-2xl font-bold text-green-900 border-b border-green-900/10 pb-4">
                একই টাকা (কোথায় বেশি লাভ)
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-800 font-extrabold text-xs">জমি (Land)</span>
                    <span className="text-xs text-gray-600 font-medium">ঝুঁকি: কম | রিটার্ন: উচ্চ 📈</span>
                  </div>
                  <span className="text-xs font-bold text-green-700">সেরা লাভজনক</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 font-extrabold text-xs">ফ্ল্যাট (Flat)</span>
                    <span className="text-xs text-gray-600 font-medium">ঝুঁকি: বেশি | রিটার্ন: কম</span>
                  </div>
                  <span className="text-xs text-gray-500">পুরানো হলে দাম কমে</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-extrabold text-xs">স্বর্ণ (Gold)</span>
                    <span className="text-xs text-gray-600 font-medium">ঝুঁকি: মাঝারি | রিটার্ন: মাঝারি</span>
                  </div>
                  <span className="text-xs text-gray-500">সীমিত রিটার্ন</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between opacity-80">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs">ব্যাংক (Bank)</span>
                    <span className="text-xs text-gray-600 font-medium">ঝুঁকি: কম | রিটার্ন: খুব কম</span>
                  </div>
                  <span className="text-xs text-gray-500">মুদ্রাস্ফীতিতে ক্ষতি</span>
                </div>
              </div>

              <button
                onClick={() => handleBookVisit("Location & Route Visit")}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/30 transition flex items-center justify-center gap-2"
              >
                <CalendarDays className="h-5 w-5 text-amber-300" />
                ফ্রি সাইট ভিজিট বুক করুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-wide">Greenleaf Holdings Ltd.</h3>
            <p className="text-sm text-green-100/70 font-light leading-relaxed">
              Providing beautiful, eco-friendly real-estate solutions for high-end urban dwelling. Experience the peace of nature with state-of-the-art facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#amenities" className="hover:text-amber-400 transition">Amenities</a></li>
              <li><a href="#plots" className="hover:text-amber-400 transition">Available Plots</a></li>
              <li><a href="#location" className="hover:text-amber-400 transition">Location</a></li>
            </ul>
          </div>

          {/* Legal / Admin */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Office Hours</h4>
            <p className="text-sm text-green-100/70">Saturday - Thursday<br />9:00 AM - 6:00 PM</p>
            <div className="pt-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline"
              >
                Admin Login Dashboard &rarr;
              </a>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span>01898777431</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>greengardencitypurbachal@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Greenleaf Holdings Ltd., Kaliganj, Gazipur</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 md:px-8 border-t border-green-900/60 pt-8 text-center text-xs text-green-100/40">
          <p>&copy; {new Date().getFullYear()} Greenleaf Holdings Ltd. Ltd. All rights reserved. Designed for elite living.</p>
        </div>
      </footer>

      {/* Booking Scheduling Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlot={selectedProjectTitle}
      />
    </div>
  );
}
