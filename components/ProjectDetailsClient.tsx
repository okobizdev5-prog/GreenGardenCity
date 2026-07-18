"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";
import { MapPin, Phone, Mail, ChevronRight, CalendarCheck, Home, Image as ImageIcon } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  status?: string;
};

type ProjectDetailsClientProps = {
  project: Project;
};

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => setIsBookingOpen(true)} />

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white px-4 py-2.5 rounded-xl border border-gray-150 shadow-xxs">
          <a href="/" className="hover:text-green-700 transition flex items-center gap-1">
            <Home className="h-3.5 w-3.5" /> Home
          </a>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <a href="/projects" className="hover:text-green-700 transition">Projects</a>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-green-800 font-bold truncate max-w-[200px]" title={project.title}>
            {project.title}
          </span>
        </nav>

        {/* Two-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Project Description (Rich Text HTML) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-green-950 tracking-tight leading-tight border-b border-gray-100 pb-4 flex flex-wrap items-center gap-3">
              <span>{project.title}</span>
              {project.status && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xxs ${
                  project.status === "Upcoming" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  project.status === "Delivered" ? "bg-green-50 text-green-700 border-green-200" :
                  "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {project.status}
                </span>
              )}
            </h1>

            {/* Custom styling inside rich description rendering */}
            <div 
              className="prose prose-sm sm:prose-base prose-green max-w-none text-gray-700 leading-relaxed space-y-4 
                prose-headings:text-green-900 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                prose-strong:text-green-950 prose-strong:font-bold
                prose-a:text-green-700 prose-a:underline hover:prose-a:text-green-800"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            {/* Inquire widget inside description */}
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-green-900 text-sm">Want to view this project in person?</h4>
                <p className="text-xs text-gray-600">Schedule a free physical tour with our estate managers.</p>
              </div>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                <CalendarCheck className="h-4 w-4" /> Book Site Visit
              </button>
            </div>
          </div>

          {/* Right Column: Stacked Project Images Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Project Renders & Gallery</h3>
            
            <div className="flex flex-col gap-6">
              {project.images && project.images.length > 0 ? (
                project.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-150/70 bg-white transition-all duration-300 group"
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} render ${idx + 1}`} 
                      className="w-full object-cover aspect-video sm:aspect-4/3 lg:aspect-video group-hover:scale-103 transition duration-500" 
                    />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Render #{idx + 1}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-white">
                  <ImageIcon className="h-10 w-10 text-gray-300 mb-1.5" />
                  <span className="text-xs font-medium">No gallery images uploaded</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900 mt-20">
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

      {/* Booking Scheduling Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialPlot={project.title}
      />
    </div>
  );
}
