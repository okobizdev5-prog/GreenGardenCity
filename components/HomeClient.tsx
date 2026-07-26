"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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
  Home,
  X,
  Map,
  Navigation,
  ArrowDown
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";
import { FloatingContactButtons } from "@/components/FloatingContactButtons";

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

import type { AboutData } from "@/app/actions/aboutActions";
import type { GalleryItemData } from "@/app/actions/galleryActions";
import { createReviewAction } from "@/app/actions/reviewActions";

type ReviewData = {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
};

type HomeClientProps = {
  initialProjects: Project[];
  banner?: BannerData;
  banners?: BannerData[];
  about?: AboutData;
  galleryItems?: GalleryItemData[];
  reviews?: ReviewData[];
};

const isVideo = (url?: string) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes("/uploads/video") || url.includes("video");
};

type VideoSlideProps = {
  src: string;
  isActive: boolean;
  onEnded: () => void;
  onError: () => void;
};

function VideoSlide({ src, isActive, onEnded, onError }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.play().catch(err => {
        console.warn("Autoplay blocked or video failed to play:", err);
      });
    } else {
      video.pause();
    }
  }, [isActive, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      onEnded={onEnded}
      onError={onError}
      className="w-full h-full object-cover"
    />
  );
}

const fallbackReviews: ReviewData[] = [
  {
    id: "fallback-1",
    name: "ড. মো: আনিসুর রহমান",
    role: "সরকারি কর্মকর্তা ও প্লট ক্রেতা",
    rating: 5,
    comment: "গ্রীন গার্ডেন সিটি ঢাকার এত কাছে এবং সম্পূর্ণ পরিকল্পিত উপায়ে তৈরি করা হচ্ছে দেখে আমি খুবই মুগ্ধ। বিশেষ করে তাদের চওড়া রাস্তা এবং লেকের প্রাকৃতিক পরিবেশ আমাদের মতো অবসরপ্রাপ্ত মানুষের বসবাসের জন্য আদর্শ।",
  },
  {
    id: "fallback-2",
    name: "সায়েম চৌধুরী",
    role: "ব্যবসায়ী ও বিনিয়োগকারী",
    rating: 5,
    comment: "আমি ৩টি প্লট নিয়েছি ভবিষ্যৎ বিনিয়োগের জন্য। রেজিস্ট্রি ও কাগজপত্র বুঝে পাওয়ার প্রক্রিয়াটি খুবই স্বচ্ছ এবং ঝামেলামুক্ত ছিল।",
  },
  {
    id: "fallback-3",
    name: "নুসরাত জাহান লিয়া",
    role: "আইটি প্রফেশনাল ও গৃহিণী",
    rating: 5,
    comment: "বাচ্চাদের খেলার মাঠ, পার্ক এবং বিশাল মসজিদের ডিজাইন আমাকে সবচেয়ে বেশি আকৃষ্ট করেছে। বুকিং করার পর থেকেই তাদের সেবা চমৎকার।",
  },
];

export function HomeClient({ initialProjects, banner, banners, about, galleryItems = [], reviews = [] }: HomeClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Inquiry");
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await createReviewAction({
        name: reviewName.trim(),
        role: reviewRole.trim() || "Client",
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (res.success) {
        setReviewSubmitted(true);
        setReviewName("");
        setReviewRole("");
        setReviewRating(5);
        setReviewComment("");
        setTimeout(() => {
          setReviewSubmitted(false);
          setIsReviewModalOpen(false);
        }, 3000);
      } else {
        alert(res.error || "Failed to submit review.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setIsSubmittingReview(false);
  };

  const handleBookVisit = (projectTitle: string = "General Inquiry") => {
    setSelectedProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

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
            subtitle: "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Green Garden City.",
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

  // Auto-play carousel slider based on slide media type
  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const currentBanner = activeBanners[currentSlideIndex];
    const isVid = isVideo(currentBanner?.bgImage);

    // If it's a video, we wait for onEnded to fire from the VideoSlide component.
    if (isVid) return;

    // If it's a photo, set a 6-second timer
    const timer = setTimeout(() => {
      handleNextSlide();
    }, 6000);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, activeBanners]);

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const currentBanner = activeBanners[currentSlideIndex] || activeBanners[0];

  // Find project for Residential Slot
  const residentialProject = initialProjects.find(p => p.category?.toLowerCase().includes("residential"))
    || initialProjects.find(p => p.title?.toLowerCase().includes("residential"))
    || null;

  // Find project for Commercial Slot
  const commercialProject = initialProjects.find(p => p.category?.toLowerCase().includes("commercial"))
    || initialProjects.find(p => p.title?.toLowerCase().includes("commercial"))
    || null;

  // Find project for House & Garden Slot
  const houseGardenProject = initialProjects.find(p => p.category?.toLowerCase().includes("house") || p.category?.toLowerCase().includes("garden"))
    || initialProjects.find(p => p.title?.toLowerCase().includes("house") || p.title?.toLowerCase().includes("garden"))
    || null;

  const resCard = residentialProject || initialProjects[0] || {
    id: "default-res",
    title: "Residential Plots",
    description: "Premium eco-friendly residential plots designed for sustainable living. Complete with 30-40 ft wide carpeting roads, gated security, lakes, and utilities.",
    images: ["/project_image1.png"],
    category: "Residential",
    status: "Delivered"
  };

  const commCard = commercialProject || initialProjects[1] || {
    id: "default-comm",
    title: "Commercial Hubs",
    description: "High-value commercial land options adjacent to the expressway, offering maximum visibility and business infrastructure for investors.",
    images: ["/project_image2.png"],
    category: "Commercial",
    status: "Upcoming"
  };

  const gardenCard = houseGardenProject || initialProjects[2] || {
    id: "default-garden",
    title: "House & Garden Plots",
    description: "Luxurious garden estate land options featuring private greenery, natural lake access, and open landscapes for beautiful holiday homes.",
    images: ["/project_image3.png"],
    category: "Garden House",
    status: "Ongoing"
  };

  const finalThreeCards = [resCard, commCard, gardenCard];

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
      <section className="relative w-full h-[65vh] sm:h-[70vh] md:h-[80vh] lg:h-[88vh] pt-18 md:pt-20 overflow-hidden bg-gray-950">
        <div className="relative w-full h-full">
          {activeBanners.map((banner, idx) => {
            const mediaUrl = banner.bgImage || "/hero_background.png";
            const isActive = idx === currentSlideIndex;
            const isVid = isVideo(mediaUrl);
                const hasTextOverlay = !!(
                  banner.title?.trim() ||
                  banner.highlightTitle?.trim() ||
                  banner.badgeText?.trim() ||
                  banner.subtitle?.trim() ||
                  (banner.highlights && banner.highlights.length > 0)
                );

                return (
                  <div
                    key={banner.id || idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                  >
                    {isVid ? (
                      <VideoSlide
                        src={mediaUrl}
                        isActive={isActive}
                        onEnded={handleNextSlide}
                        onError={handleNextSlide}
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={`Slide ${idx + 1}`}
                        className={`w-full h-full object-cover ${isActive ? "animate-kenburns" : ""}`}
                      />
                    )}
                    
                    {hasTextOverlay && (
                      <>
                        {/* Subtle dark overlay for premium look */}
                        <div className="absolute inset-0 bg-black/45 z-10"></div>

                        {/* Premium Banner Content Overlay */}
                        <div className="absolute inset-0 z-20 flex items-center">
                          <div className="container mx-auto px-4 md:px-8 max-w-7xl w-full">
                            <div className="max-w-3xl space-y-4 md:space-y-6 text-left">
                              {banner.badgeText && (
                                <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xxs sm:text-xs font-bold uppercase tracking-widest border border-amber-400/30 backdrop-blur-md">
                                  {banner.badgeText}
                                </span>
                              )}

                              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight select-none">
                                {banner.title}{" "}
                                {banner.highlightTitle && (
                                  <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                                    {banner.highlightTitle}
                                  </span>
                                )}
                              </h1>

                              {banner.subtitle && (
                                <p className="text-xs sm:text-sm md:text-lg text-gray-200 font-light leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
                                  {banner.subtitle}
                                </p>
                              )}

                              {/* Highlights */}
                              {banner.highlights && banner.highlights.length > 0 && (
                                <div className="hidden sm:grid grid-cols-2 gap-3 max-w-xl pt-2">
                                  {banner.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-semibold">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                                      <span>{h}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* CTA Buttons */}
                              <div className="pt-2 md:pt-4 flex flex-wrap gap-3">
                                <button
                                  onClick={() => handleBookVisit(banner.primaryBtnText || "Book a Site Visit")}
                                  className="bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 text-xs sm:text-sm cursor-pointer shadow-lg active:scale-97 hover:scale-103 flex items-center gap-2"
                                >
                                  <CalendarDays className="h-4.5 w-4.5 text-amber-300" />
                                  <span>{banner.primaryBtnText || "Book a Site Visit"}</span>
                                </button>
                                <a
                                  href={banner.secondaryBtnLink || "#plots"}
                                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 text-xs sm:text-sm border border-white/20 backdrop-blur-xs flex items-center justify-center cursor-pointer active:scale-97 hover:scale-103"
                                >
                                  {banner.secondaryBtnText || "Explore Plots"}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
          })}
        </div>

        {/* Carousel Dot Indicators (only if multiple banners exist) */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex items-center gap-2.5 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlideIndex
                  ? "w-8 bg-green-400"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-green-100">
              {about?.badge || "About Our Vision"}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-green-900 tracking-tight leading-tight">
              {about?.title || "A Glimpse into Sustainable Luxury"}
            </h2>

            {/* Video / Media container for Mobile only (renders below Title, before Description) */}
            <div className="block lg:hidden relative rounded-2xl overflow-hidden shadow-xl my-4">
              {isVideo(about?.mediaUrl || "/vision_image.png") ? (
                <video
                  src={about?.mediaUrl || "/vision_image.png"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover aspect-video hover:scale-102 transition duration-500"
                />
              ) : (
                <img
                  src={about?.mediaUrl || "/vision_image.png"}
                  alt={about?.title || "Green Garden City Vision"}
                  className="w-full object-cover aspect-video hover:scale-105 transition duration-500"
                />
              )}
            </div>

            {about?.desc1 && (
              <div
                className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed rich-text-content"
                dangerouslySetInnerHTML={{ __html: about.desc1 }}
              />
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-green-50/45 p-4 sm:p-5 rounded-2xl hover:bg-green-50/60 transition-colors duration-300">
                <h4 className="text-xl sm:text-2xl font-extrabold text-green-800">
                  {about?.stat1Num || "100+"}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mt-1">
                  {about?.stat1Label || "Happy Plot Buyers"}
                </p>
              </div>
              <div className="bg-green-50/45 p-4 sm:p-5 rounded-2xl hover:bg-green-50/60 transition-colors duration-300">
                <h4 className="text-xl sm:text-2xl font-extrabold text-green-800">
                  {about?.stat2Num || "40%"}
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600 font-semibold mt-1">
                  {about?.stat2Label || "Dedicated Greenery & Lakes"}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex w-full">
              <button
                onClick={() => handleBookVisit("About Vision - Book Site Visit")}
                className="group relative overflow-hidden animate-shimmer animate-glow-ring bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-sm cursor-pointer w-full sm:w-auto text-center active:scale-97 hover:scale-103 shadow-lg"
              >
                <CalendarDays className="h-4.5 w-4.5 text-amber-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0" />
                <span className="whitespace-nowrap">Book a Site Visit</span>
              </button>
            </div>
          </div>

          {/* Video / Media container for Desktop only */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {isVideo(about?.mediaUrl || "/vision_image.png") ? (
                <video
                  src={about?.mediaUrl || "/vision_image.png"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover aspect-video lg:aspect-4/3 hover:scale-102 transition duration-500"
                />
              ) : (
                <img
                  src={about?.mediaUrl || "/vision_image.png"}
                  alt={about?.title || "Green Garden City Vision"}
                  className="w-full object-cover aspect-video lg:aspect-4/3 hover:scale-105 transition duration-500"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-12 bg-linear-to-b from-white to-gray-50 border-t border-b border-gray-100/50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Master Plan & Landscape</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight">
              Photo Gallery
            </h2>
            <p className="text-gray-500 font-medium">
              A visual tour of the serene natural surroundings, modern internal roads, and premium infrastructure design at Green Garden City.
            </p>
          </div>

          {galleryItems && galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryItems.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => {
                    setLightboxIndex(index);
                    setIsLightboxOpen(true);
                  }}
                  className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Visual hover indicator */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/95 text-green-950 font-bold text-xxs px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform duration-300">
                      View Fullscreen 🔍
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center max-w-xl mx-auto shadow-xs">
              <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Actual site photos will be available soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Route Timeline Section */}
      <section id="route" className="py-12 bg-linear-to-b from-white to-gray-50/50 border-t border-gray-100/50 relative overflow-hidden">
        {/* Subtle decorative background geographic elements */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest border border-green-100">
              <Map className="h-4 w-4 text-green-600" /> Project Location Map
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
              Route & Waypoint Guide
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
              Follow our animated GPS route waypoints to easily drive to Green Garden City from Kuril Flyover.
            </p>
          </div>

          {/* Timeline Grid */}
          <div className="relative">
            {/* SVG Flowing Highway Path (Animate dotted line to represent highway motion) */}
            <svg className="absolute inset-x-0 top-12.5 h-7.5 w-full hidden lg:block z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 30">
              <path d="M 50 15 L 950 15" fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
              <path className="animate-route-flow" d="M 50 15 L 950 15" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" strokeDasharray="16 8" />
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="group bg-white rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-5xl font-extrabold text-green-700/5 select-none font-sans">01</div>
                <div className="space-y-5">
                  {/* Pulsing Start waypoint */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/40 opacity-75"></span>
                      <MapPin className="h-4.5 w-4.5 text-blue-600 relative z-10" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Start Point</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition-colors">Kuril Flyover</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Start your journey on the 300 Ft Purbachal Expressway.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 text-xxs font-bold text-gray-400 flex items-center gap-2 group-hover:text-green-700 transition-colors">
                  <Navigation className="h-4 w-4 text-blue-500 rotate-45 group-hover:scale-110 transition-transform" />
                  <span>300 Ft Expressway</span>
                </div>
              </div>

              {/* Mobile Arrow Connector 1-2 */}
              <div className="flex flex-col items-center justify-center sm:hidden -my-2 z-20 col-span-1">
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
                <div className="bg-green-600 text-white rounded-full p-2 flex items-center justify-center shadow-md animate-bounce">
                  <ArrowDown className="h-4 w-4 text-white" />
                </div>
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
              </div>

              {/* Step 2 */}
              <div className="group bg-white rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-5xl font-extrabold text-green-700/5 select-none font-sans">02</div>
                <div className="space-y-5">
                  {/* Pulsing waypoint */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-750 font-bold shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/30 opacity-75"></span>
                      <MapPin className="h-4.5 w-4.5 text-green-600 relative z-10" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-green-700 tracking-wider">⏱️ 20 Min Drive</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition-colors">Purbachal Club</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Drive straight past Purbachal Club and General Bima office.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 text-xxs font-bold text-gray-400 flex items-center gap-2 group-hover:text-green-700 transition-colors">
                  <Road className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                  <span>Pass Purbachal Sports City</span>
                </div>
              </div>

              {/* Mobile Arrow Connector 2-3 */}
              <div className="flex flex-col items-center justify-center sm:hidden -my-2 z-20 col-span-1">
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
                <div className="bg-green-600 text-white rounded-full p-2 flex items-center justify-center shadow-md animate-bounce">
                  <ArrowDown className="h-4 w-4 text-white" />
                </div>
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
              </div>

              {/* Step 3 */}
              <div className="group bg-white rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-5xl font-extrabold text-green-700/5 select-none font-sans">03</div>
                <div className="space-y-5">
                  {/* Pulsing waypoint */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-750 font-bold shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/30 opacity-75"></span>
                      <MapPin className="h-4.5 w-4.5 text-amber-600 relative z-10" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">⏱️ 10 Min Drive</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-800 transition-colors">Sector 25</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Keep driving straight until you cross Nilla Market and reach Sector 25.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 text-xxs font-bold text-gray-400 flex items-center gap-2 group-hover:text-green-700 transition-colors">
                  <Compass className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Pass Nilla Market & Sector 25</span>
                </div>
              </div>

              {/* Mobile Arrow Connector 3-4 */}
              <div className="flex flex-col items-center justify-center sm:hidden -my-2 z-20 col-span-1">
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
                <div className="bg-green-600 text-white rounded-full p-2 flex items-center justify-center shadow-md animate-bounce">
                  <ArrowDown className="h-4 w-4 text-white" />
                </div>
                <div className="w-0.5 h-6 border-l-2 border-dashed border-green-500/50" />
              </div>

              {/* Step 4 (Destination) */}
              <div className="group bg-linear-to-br from-green-800 to-green-950 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:shadow-green-900/40 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-4 right-6 text-5xl font-extrabold text-white/5 select-none font-sans">04</div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-5">
                  {/* Pulsing Destination radar */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-green-950 font-bold shrink-0 border border-white/10 shadow-md">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-80"></span>
                      <MapPin className="h-5 w-5 text-green-950 relative z-10" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">Destination</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-white">Green Garden City</h3>
                    <p className="text-xs text-green-100/80 leading-relaxed font-light">
                      Drive 5 mins from Sector 25 to reach the project entrance adjacent to Jhinga Park.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-green-800 text-xxs font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                  <span>Kaliganj, Gazipur (Purbachal)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* What You Get Section (গ্রীন গার্ডেন সিটি থেকে যা পাচ্ছেন) */}
      <section className="py-12 bg-linear-to-b from-green-900 via-green-950 to-green-950 text-white relative overflow-hidden">
        {/* Subtle decorative background glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-400/20 shadow-sm animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Exclusive Privileges
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
              গ্রীন গার্ডেন সিটি থেকে যা পাচ্ছেন
            </h2>
            <p className="text-emerald-100/80 text-sm md:text-base font-light leading-relaxed font-sans">
              Why Green Garden City is the most secure, high-value eco land project in Purbachal region.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <circle cx="10" cy="15" r="3" />
                    <path d="M12 17.5L13.5 21l-1.5-1-1.5 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">এককালীন রেজিস্ট্রি</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  এককালীন মূল্য পরিশোধের সাথে সাথে সাফ-কবলা জমি রেজিস্ট্রি ও মিউটেশন সুবিধা।
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <circle cx="12" cy="11" r="3" />
                    <path d="M12 11h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">ডিজিটাল সিকিউরিটি</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  ২৪/৭ ডিজিটাল সিসিটিভি সার্ভেইল্যান্স, বাউন্ডারি ওয়াল এবং স্মার্ট সিকিউরিটি গেট।
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 3c-2.5 0-3.5 2.5-3.5 5h7c0-2.5-1-5-3.5-5z" />
                    <path d="M12 3V1" />
                    <rect x="6" y="8" width="12" height="12" rx="1" />
                    <path d="M9 20v-4c0-0.8 0.7-1.5 1.5-1.5h3c0.8 0 1.5 0.7 1.5 1.5v4" />
                    <path d="M3 20V8.5l1.5-1.5L6 8.5V20" />
                    <path d="M18 20V8.5l1.5-1.5 1.5 1.5V20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">কেন্দ্রীয় জামে মসজিদ</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  প্রকল্পের ভেতরে আধুনিক স্থাপত্যে পরিকল্পিত নিজস্ব কেন্দ্রীয় জামে মসজিদ।
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 19c1.5-0.8 3.5-0.8 5 0s3.5 0.8 5 0 3.5-0.8 5 0 3.5 0.8 5 0" />
                    <path d="M2 16c1.5-0.8 3.5-0.8 5 0s3.5 0.8 5 0 3.5-0.8 5 0 3.5 0.8 5 0" />
                    <path d="M12 4l3 5H9l3-5z" />
                    <path d="M12 9v4" />
                    <path d="M6 7l2 3H4l2-3z" />
                    <path d="M6 10v3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">গ্রীন ইকো পার্ক ও লেক</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  সবুজ পরিবেশ, নান্দনিক প্রাকৃতিক লেক, বসার জোন এবং ওয়াকিং ট্র্যাক।
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 20L10 4h4l5 16" />
                    <path d="M8 9h8" />
                    <line x1="11" y1="9" x2="11" y2="15" />
                    <line x1="13" y1="9" x2="13" y2="15" />
                    <rect x="10.5" y="15" width="3" height="1" rx="0.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">শিশুদের খেলার মাঠ</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  নিরাপদ ও সুপরিসর প্লেইং গ্রাউন্ড, স্পোর্টস জোন এবং বাচ্চাদের পার্ক।
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 22L9 2h6l5 22" />
                    <line x1="12" y1="18" x2="12" y2="14" strokeDasharray="3 3" />
                    <line x1="12" y1="10" x2="12" y2="6" strokeDasharray="3 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">৩০-৪০ ফুট প্রশস্ত রাস্তা</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  প্রতিটি প্লটের সামনে ৩০, ৩৫ ও ৪০ ফুট প্রশস্ত কার্পেটিং অভ্যন্তরীণ রাস্তা।
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="group bg-linear-to-br from-green-950/80 to-green-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-400/35 transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden shadow-xl shadow-green-950/30 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-2">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="space-y-5">
                <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-300 text-green-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] group-hover:scale-108 transition duration-500">
                  <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <svg className="h-7 w-7 text-green-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-serif text-white group-hover:text-amber-300 transition-colors leading-snug">দীর্ঘমেয়াদি সহজ কিস্তি</h3>
                <p className="text-emerald-50/80 text-xs sm:text-sm font-light font-sans leading-relaxed">
                  ক্রেতাদের সুবিধার্থে দীর্ঘমেয়াদি সহজ সুদমুক্ত কিস্তিতে প্লট কেনার সুযোগ।
                </p>
              </div>
            </div>

            {/* Feature 8 - Plot Sizes */}
            <div className="group bg-linear-to-br from-green-950 to-green-900/60 p-6 sm:p-8 rounded-3xl border border-amber-400/30 shadow-2xl flex flex-col justify-between h-full hover:-translate-y-2 hover:shadow-amber-500/10 transition duration-500 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-400/20 via-amber-400 to-amber-400/20" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">AVAILABLE PLOTS</span>
                <h3 className="text-xl font-extrabold text-white mt-1 mb-3 font-serif leading-snug">৩, ৫ ও ১০ কাঠার প্লট</h3>
                <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed font-medium font-sans">
                  আপনার বাজেট ও প্রয়োজন অনুযায়ী রেডি প্লট বুকিং চলছে।
                </p>
              </div>
              <button
                onClick={() => handleBookVisit("Plot Size Inquiry")}
                className="mt-6 w-full bg-linear-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-green-950 font-extrabold text-xs py-3 rounded-xl transition duration-300 shadow-[0_4px_15px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] cursor-pointer active:scale-97 uppercase tracking-wider"
              >
                বুকিং পরামর্শ চান &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Projects Showcase Section */}
      <section id="plots" className="py-12 bg-gray-50 border-t border-gray-150">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mb-10 space-y-3">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3.5 py-1.5 rounded-full border border-green-100 inline-block w-fit">
            Master Blueprints
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight font-serif">
            Select Your Dream Plot
          </h2>
          <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
            Choose from our premium residential communities, smart commercial hubs, and elite house gardens.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
          {finalThreeCards.map((project) => {
            const activeIdx = activeImageIndexes[project.id] || 0;
            const currentImg = project.images && project.images.length > 0 ? project.images[activeIdx] : "/hero_background.png";
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
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group"
              >
                {/* Image showcase wrapper */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100 group/slider">
                  <Link href={`/projects/${project.id}`} className="block w-full h-full">
                    <img
                      src={currentImg}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Slide buttons */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-xs z-10 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-xs z-10 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/45 px-2 py-0.5 rounded-full backdrop-blur-xs z-10">
                        {project.images.map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotIdx === activeIdx ? "bg-white scale-125" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Card description details */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <Link href={`/projects/${project.id}`} className="hover:text-green-800 transition block">
                      <h3 className="text-xl font-bold font-serif text-gray-900 leading-snug group-hover:text-green-800 transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <div
                      className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light line-clamp-4 mt-2"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 bg-white hover:bg-gray-50 text-green-800 border border-green-200 font-semibold py-3 rounded-xl shadow-xs transition duration-300 text-center text-xs flex items-center justify-center cursor-pointer"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleBookVisit(project.title)}
                      className="flex-1 bg-linear-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <CalendarDays className="h-3.5 w-3.5 text-amber-300 group-hover:rotate-6 transition-transform" />
                      <span>Book Site Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* Investment Comparison Section */}
      <section className="py-16 bg-white border-t border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest border border-amber-100">
              Investment Comparison
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight font-serif">
              একই টাকা (কোথায় বেশি লাভ)
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans">
              অন্যান্য বিনিয়োগ মাধ্যমের সাথে তুলনা করে রিয়েল এস্টেট বা জমি ক্রয়ে আপনার দীর্ঘমেয়াদী বিনিয়োগের নিরাপত্তা ও সর্বোচ্চ রিটার্ন নিশ্চিত করুন।
            </p>
          </div>

          <div className="space-y-4">
            {/* Land Card - Highlighted, premium look */}
            <div className="relative p-5 sm:p-6 bg-linear-to-br from-green-950 to-green-900 text-white rounded-2xl border border-amber-400/40 shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
              <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Compass className="h-6 w-6 text-green-950" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-green-950 font-black text-[10px] uppercase tracking-wider mb-1">জমি (Land)</span>
                  <p className="text-sm font-semibold text-white/95">ঝুঁকি: অত্যন্ত কম | রিটার্ন: আজীবন ক্রমবর্ধমান 📈</p>
                </div>
              </div>
              <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                <span className="inline-block bg-amber-400 text-green-950 font-black text-xs px-4 py-2 rounded-xl shadow-xs border border-amber-500 animate-pulse whitespace-nowrap">
                  সেরা লাভজনক ⭐
                </span>
              </div>
            </div>

            {/* Flat Card */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80 hover:opacity-100 group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-650 group-hover:text-white transition duration-300">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 font-extrabold text-[10px] uppercase tracking-wider mb-1">ফ্ল্যাট (Flat)</span>
                  <p className="text-sm font-medium text-gray-700">ঝুঁকি: বেশি | রিটার্ন: সীমিত</p>
                </div>
              </div>
              <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
                  পুরানো হলে দাম কমে যায়
                </span>
              </div>
            </div>

            {/* Gold Card */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80 hover:opacity-100 group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition duration-300">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase tracking-wider mb-1">স্বর্ণ (Gold)</span>
                  <p className="text-sm font-medium text-gray-700">ঝুঁকি: মাঝারি | রিটার্ন: মাঝারি</p>
                </div>
              </div>
              <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
                  সীমিত বা বার্ষিক রিটার্ন
                </span>
              </div>
            </div>

            {/* Bank Card */}
            <div className="p-5 sm:p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80 hover:opacity-100 group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                  <Landmark className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider mb-1">ব্যাংক (Bank)</span>
                  <p className="text-sm font-medium text-gray-700">ঝুঁকি: কম | রিটার্ন: খুব কম</p>
                </div>
              </div>
              <div className="shrink-0 self-stretch sm:self-auto flex items-center justify-end">
                <span className="text-xs font-semibold text-red-600 bg-red-50/60 border border-red-100 px-3.5 py-1.5 rounded-xl whitespace-nowrap">
                  মুদ্রাস্ফীতির কারণে আর্থিক ক্ষতি
                </span>
              </div>
            </div>
          </div>

          <div className="pt-10 flex justify-center">
            <button
              onClick={() => handleBookVisit("Location & Route Visit")}
              className="group relative overflow-hidden animate-shimmer animate-glow-ring bg-green-700 hover:bg-green-800 text-white font-extrabold py-4 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer shadow-lg active:scale-97 hover:scale-102 hover:shadow-green-900/35"
            >
              <CalendarDays className="h-5 w-5 text-amber-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0" />
              <span>ফ্রি সাইট ভিজিট বুক করুন</span>
            </button>
          </div>
        </div>
      </section>



      {/* Customer Reviews / Testimonials Section */}
      <section className="py-16 bg-linear-to-b from-gray-50 to-white border-t border-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest border border-amber-100">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight font-serif">
              আমাদের সম্মানিত গ্রাহকদের মতামত
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              যারা ইতিমধ্যে গ্রীন গার্ডেন সিটিতে তাদের স্বপ্নের প্লট বেছে নিয়েছেন, তাদের অভিজ্ঞতা জানুন।
            </p>
          </div>

          {/* Swiper Carousel for Testimonials */}
          <div className="testimonial-swiper-wrapper relative px-4 sm:px-12">
            <Swiper
              modules={[Autoplay, Pagination, SwiperNavigation]}
              spaceBetween={24}
              slidesPerView={1}
              loop={displayReviews.length > 3}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="testimonial-swiper pb-14!"
            >
              {displayReviews.map((review) => (
                <SwiperSlide key={review.id} className="h-auto!">
                  <div
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-5 group h-full border border-gray-100/80"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4.5 w-4.5 ${i < review.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-600 leading-relaxed font-normal flex-1">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* Reviewer info */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-700 to-green-900 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{review.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{review.role}</p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Prev/Next Arrows */}
            <button className="hidden sm:flex swiper-button-prev-custom absolute left-0 top-[42%] -translate-y-1/2 h-9 w-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-green-700 hover:text-white flex items-center justify-center shadow-xs transition z-20 cursor-pointer hover:border-green-700">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex swiper-button-next-custom absolute right-0 top-[42%] -translate-y-1/2 h-9 w-9 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-green-700 hover:text-white flex items-center justify-center shadow-xs transition z-20 cursor-pointer hover:border-green-700">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="pt-10 flex justify-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="group bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-sm cursor-pointer shadow-lg hover:shadow-green-900/30 active:scale-97"
            >
              <Sparkles className="h-4.5 w-4.5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              <span>আপনার মতামত দিন</span>
            </button>
          </div>
        </div>
      </section>

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-linear-to-r from-green-800 to-green-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <h3 className="text-lg font-bold">আপনার মতামত দিন</h3>
              </div>
              <button onClick={() => { setIsReviewModalOpen(false); setReviewSubmitted(false); }} className="text-white/70 hover:text-white transition p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="p-10 text-center space-y-4">
                <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-700" />
                </div>
                <h4 className="text-xl font-bold text-green-900">ধন্যবাদ!</h4>
                <p className="text-sm text-gray-500">আপনার মতামত সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর এটি প্রদর্শিত হবে।</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                {/* Star Rating */}
                <div className="flex flex-col items-center gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">রেটিং দিন</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        onMouseEnter={() => setReviewHoverRating(i + 1)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="p-0.5 cursor-pointer transition-transform hover:scale-125"
                      >
                        <svg className={`h-8 w-8 transition-colors ${(reviewHoverRating || reviewRating) > i ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="rounded-xl border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                      placeholder="যেমনঃ মো: রফিকুল ইসলাম"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">পেশা / পরিচয়</label>
                    <input
                      type="text"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      className="rounded-xl border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                      placeholder="যেমনঃ ব্যবসায়ী"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">আপনার মতামত *</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="rounded-xl border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700 resize-none"
                    placeholder="গ্রীন গার্ডেন সিটি সম্পর্কে আপনার অভিজ্ঞতা এবং মতামত লিখুন..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  {isSubmittingReview ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      জমা হচ্ছে...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="h-4.5 w-4.5" />
                      মতামত জমা দিন
                    </span>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  আপনার মতামত অ্যাডমিন অনুমোদনের পরে ওয়েবসাইটে প্রদর্শিত হবে।
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info & Office Hours */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white tracking-wide">Green Garden City</h3>
              <p className="text-sm text-green-100/70 font-light leading-relaxed">
                Providing beautiful, eco-friendly real-estate solutions for high-end urban dwelling. Experience the peace of nature with state-of-the-art facilities.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Office Hours</h4>
              <p className="text-xs text-green-100/70">Saturday - Thursday<br />9:00 AM - 6:00 PM</p>
              <div className="pt-1">
                <a
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline"
                >
                  Admin Dashboard &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#amenities" className="hover:text-amber-400 transition">Amenities</a></li>
              <li><a href="#plots" className="hover:text-amber-400 transition">Available Plots</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>01898777431</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="break-all">greengardencitypurbachal@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Green Garden City, Kaliganj, Gazipur</span>
              </li>
            </ul>
          </div>

          {/* Map on the right side */}
          <div id="footer-map" className="space-y-4">
            <h4 className="font-bold text-white text-base">Our Location</h4>
            <div className="overflow-hidden rounded-2xl border border-green-900 shadow-md h-44 bg-green-900/10">
              <iframe
                title="Green Garden City Real Location Map"
                src="https://maps.google.com/maps?q=Kaliganj,%20Gazipur,%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="flex justify-between items-center">
              <a
                href="https://maps.google.com/?q=Kaliganj,Gazipur,Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Open Google Maps &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 md:px-8 border-t border-green-900/60 pt-8 text-center text-xs text-green-100/40">
          <p>&copy; {new Date().getFullYear()} Green Garden City Ltd. All rights reserved. Designed for elite living.</p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {isLightboxOpen && lightboxIndex !== null && galleryItems && galleryItems[lightboxIndex] && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition z-55 cursor-pointer animate-in fade-in zoom-in duration-300"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center">
            {/* Navigation buttons */}
            <button
              onClick={() => setLightboxIndex(prev => (prev! - 1 + galleryItems.length) % galleryItems.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-55 cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => setLightboxIndex(prev => (prev! + 1) % galleryItems.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition z-55 cursor-pointer"
              title="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Large Image */}
            <div className="relative max-h-[80vh] max-w-full flex items-center justify-center">
              <img
                src={galleryItems[lightboxIndex].imageUrl}
                alt={galleryItems[lightboxIndex].title}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Image Title / Counter */}
            <div className="text-center mt-6 space-y-1">
              <h4 className="text-white font-bold text-lg">{galleryItems[lightboxIndex].title}</h4>
              <p className="text-white/50 text-xs font-semibold">
                {lightboxIndex + 1} of {galleryItems.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Scheduling Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlot={selectedProjectTitle}
      />

      {/* Floating Call, WhatsApp and Booking CTA Buttons */}
      <FloatingContactButtons onBookClick={() => handleBookVisit("General Inquiry")} />
    </div>
  );
}
