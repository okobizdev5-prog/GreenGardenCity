"use client";

import { useState } from "react";
import { Sparkles, ImageIcon } from "lucide-react";
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

type ProjectsClientProps = {
  initialProjects: Project[];
};

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("General Inquiry");
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  const handleBookVisit = (projectTitle: string) => {
    setSelectedProjectTitle(projectTitle);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => handleBookVisit("General Inquiry")} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-10">
        {/* Header */}
        <header className="space-y-4 max-w-3xl">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> Choose Your Dream Plot
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
            Our Master Projects
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            Explore our curated residential masterplans, commercial spaces, and premium villa architectures in Green Garden City.
          </p>
        </header>

        {/* Projects Grouped by Category */}
        {['Residential', 'Commercial', 'Garden'].map((category) => {
          const categoryProjects = initialProjects.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
          if (categoryProjects.length === 0) return null;
          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-green-800 mb-4">{category} Plots</h2>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProjects.map((project) => {
                  const activeIdx = activeImageIndexes[project.id] || 0;
                  const currentImg = project.images && project.images.length > 0 ? project.images[activeIdx] : null;
                  const hasMultipleImages = project.images && project.images.length > 1;

                  const prevSlide = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (!project.images || project.images.length === 0) return;
                    setActiveImageIndexes(prev => ({
                      ...prev,
                      [project.id]: (activeIdx - 1 + project.images.length) % project.images.length,
                    }));
                  };

                  const nextSlide = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (!project.images || project.images.length === 0) return;
                    setActiveImageIndexes(prev => ({
                      ...prev,
                      [project.id]: (activeIdx + 1) % project.images.length,
                    }));
                  };

                  return (
                    <article
                      key={project.id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 group/slider">
                        <div className="absolute top-3.5 right-3.5 z-20 flex items-center pointer-events-none">
                          {project.category && (
                            <span className="px-2.5 py-1 rounded-lg text-xxs font-extrabold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md shadow-sm">
                              {project.category}
                            </span>
                          )}
                        </div>

                        <a href={`/projects/${project.id}`} className="block w-full h-full">
                          {currentImg ? (
                            <img src={currentImg} alt={project.title} className="w-full h-full object-cover transition duration-500" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                              <span className="text-xs">No image uploaded</span>
                            </div>
                          )}
                        </a>

                        {hasMultipleImages && (
                          <>
                            <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-green-700 text-white rounded-full p-1.5 transition opacity-0 group-hover/slider:opacity-100 shadow-sm z-10">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-xs z-10">
                              {project.images.map((_, dotIdx) => (
                                <span key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${dotIdx === activeIdx ? "bg-white scale-125" : "bg-white/50"}`} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <a href={`/projects/${project.id}`} className="hover:text-green-800 transition block">
                            <h3 className="text-xl font-bold text-gray-900 leading-tight hover:text-green-800">{project.title}</h3>
                          </a>

                          <div className="text-sm text-gray-600 line-clamp-5 prose prose-sm prose-green max-w-none leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: project.description }} />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <a href={`/projects/${project.id}`} className="flex-1 bg-white hover:bg-gray-50 text-green-800 border border-green-200 font-semibold py-2.5 rounded-lg shadow-xs transition text-center text-xs flex items-center justify-center">
                            View Details
                          </a>
                          {project.status === "Delivered" || project.status === "Sold Out" ? (
                            <button disabled className="flex-1 bg-red-50 text-red-700 border border-red-200 font-bold py-2.5 rounded-lg text-center text-xs cursor-not-allowed opacity-80">
                              SOLD OUT 🚫
                            </button>
                          ) : (
                            <button onClick={() => handleBookVisit(project.title)} className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg shadow-xs hover:shadow-md transition text-center text-xs">
                              Book Visit
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            </div>
          );
        })}

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

      {/* Floating Call, WhatsApp and Booking CTA Buttons */}
      <FloatingContactButtons onBookClick={() => handleBookVisit("General Inquiry")} />
    </div>
  );
}
