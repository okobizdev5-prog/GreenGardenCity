"use client";

import { useState } from "react";
import { 
  Road, 
  Check, 
  MapPin, 
  Compass, 
  Filter, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";

type Project = {
  id: string;
  title: string;
  size: string;
  imageUrl: string | null;
  features: string;
  price: string | null;
  zone: string;
  status: string;
};

type ProjectsClientProps = {
  initialProjects: Project[];
};

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlotSize, setSelectedPlotSize] = useState("3 Katha");
  
  // Filter States
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedSize, setSelectedSize] = useState("Any Size");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const handleBookVisit = (plotSize: string) => {
    setSelectedPlotSize(plotSize);
    setIsBookingOpen(true);
  };

  // Filter projects dynamically
  const filteredProjects = initialProjects.filter((project) => {
    const matchesZone = selectedZone === "All Zones" || project.zone === selectedZone;
    const matchesSize = selectedSize === "Any Size" || project.size === selectedSize;
    const matchesStatus = selectedStatus === "All Statuses" || project.status === selectedStatus;
    
    return matchesZone && matchesSize && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => handleBookVisit("Not Sure")} />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-12">
        {/* Header */}
        <header className="space-y-4 max-w-3xl">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Available Offerings</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
            Discover Your Perfect Plot
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            Explore our curated selection of premium land plots in Green Garden City. Secure your future in a sustainable, master-planned urban environment.
          </p>
        </header>

        {/* Filters Panel (Bento Style) */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="location">
              Location Zone
            </label>
            <select 
              className="w-full border-gray-200 border rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm font-medium text-gray-700" 
              id="location"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              <option value="All Zones">All Zones</option>
              <option value="North Sector">North Sector</option>
              <option value="South Sector">South Sector</option>
              <option value="Central Park">Central Park</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="size">
              Plot Size
            </label>
            <select 
              className="w-full border-gray-200 border rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm font-medium text-gray-700" 
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="Any Size">Any Size</option>
              <option value="3 Katha">3 Katha</option>
              <option value="5 Katha">5 Katha</option>
              <option value="10 Katha">10 Katha</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="status">
              Availability
            </label>
            <select 
              className="w-full border-gray-200 border rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm font-medium text-gray-700" 
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>

          <div>
            <button 
              onClick={() => {
                setSelectedZone("All Zones");
                setSelectedSize("Any Size");
                setSelectedStatus("All Statuses");
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" /> Reset Filters
            </button>
          </div>
        </section>

        {/* Project Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article 
              key={project.id} 
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group ${
                project.status === "Sold Out" ? "opacity-90" : ""
              }`}
            >
              {/* Plot Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Compass className="h-12 w-12 text-gray-300 mb-2" />
                    <span className="text-xs">No Image Uploaded</span>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                    project.status === "Available" 
                      ? "bg-green-700/90 text-white border-green-600/20" 
                      : "bg-red-600/90 text-white border-red-500/20"
                  }`}>
                    {project.status}
                  </span>
                  
                  <span className="bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-amber-400" /> {project.zone}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md">
                      {project.size}
                    </span>
                    {project.price && (
                      <span className={`font-bold text-lg ${
                        project.status === "Available" ? "text-green-700" : "text-gray-400 line-through"
                      }`}>
                        {project.price}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {project.title}
                  </h3>

                  {/* Features list */}
                  <ul className="space-y-2 text-sm text-gray-600">
                    {project.features.split(",").map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 mt-0.5">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-gray-700">{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                {project.status === "Available" ? (
                  <button 
                    onClick={() => handleBookVisit(project.size)}
                    className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow-md transition text-center text-sm"
                  >
                    Book Plot & Visit
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-200 text-gray-400 cursor-not-allowed font-semibold py-3 rounded-lg text-center text-sm"
                  >
                    Sold Out (Inquire Similar)
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="p-16 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No plots match filters</h3>
            <p className="text-gray-500 text-sm">
              We couldn't find any listings matching your selection. Try adjusting the zone, size, or availability filters.
            </p>
            <button
              onClick={() => {
                setSelectedZone("All Zones");
                setSelectedSize("Any Size");
                setSelectedStatus("All Statuses");
              }}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition"
            >
              Clear All Filters
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
        initialPlot={selectedPlotSize}
      />
    </div>
  );
}
