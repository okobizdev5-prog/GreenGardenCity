"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BookingModal } from "@/components/BookingModal";
import { MapPin, Phone, Mail, ChevronRight, CalendarCheck, Home, Image as ImageIcon, Compass, CheckCircle2, Sparkles } from "lucide-react";

import { PlotObject, normalizePlotObject } from "@/lib/projectUtils";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category?: string;
  status?: string;
  availablePlots?: (string | PlotObject)[];
};

type ProjectDetailsClientProps = {
  project: Project;
};

export function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const rawPlots = project.availablePlots && project.availablePlots.length > 0
    ? project.availablePlots
    : ["3 Katha", "5 Katha", "10 Katha"];

  const plotsList: PlotObject[] = rawPlots.map(normalizePlotObject);

  const isProjectDeliveredOrSoldOut =
    project.status === "Delivered" || project.status === "Sold Out";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onBookClick={() => !isProjectDeliveredOrSoldOut && setIsBookingOpen(true)} />

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

          {/* Left Column: Project Description & Dynamic Available Plots Card */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-950 tracking-tight leading-tight border-b border-gray-100 pb-4 flex flex-wrap items-center gap-3">
                <span>{project.title}</span>
                {project.status && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xxs ${project.status === "Upcoming" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      (project.status === "Delivered" || project.status === "Sold Out") ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                    {project.status === "Delivered" ? "Delivered / Sold Out" : project.status}
                  </span>
                )}
              </h1>

              {/* Custom styling inside rich description rendering */}
              <div
                className="prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-4 
                  prose-headings:text-green-950 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
                  prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl
                  prose-ul:space-y-2 prose-ul:my-4 prose-li:text-gray-700 prose-li:font-medium
                  prose-strong:text-green-950 prose-strong:font-bold
                  prose-a:text-green-700 prose-a:underline hover:prose-a:text-green-800"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />

              {/* Executive Available Plots Card */}
              <div className="bg-gradient-to-b from-white to-gray-50/80 rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5 mt-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-150 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-700 text-white flex items-center justify-center shadow-sm shrink-0">
                      <Compass className="h-5.5 w-5.5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                        Available Plots & Layout Options
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        উপলব্ধ প্লট সাইজ ও লেআউট অপশনস
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 self-start sm:self-auto">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {plotsList.filter((p) => !p.isSoldOut).length} Available / {plotsList.length} Options
                  </span>
                </div>

                {/* Plot Cards Grid - Ultra-Clean, Non-Cluttered */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {plotsList.map((plotItem, idx) => {
                    const isSold = plotItem.isSoldOut || isProjectDeliveredOrSoldOut;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 group ${
                          isSold
                            ? "bg-red-50/60 border-red-200 text-red-950"
                            : "bg-white border-gray-200 hover:border-green-600 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Option #{idx + 1}</span>
                          <span className={`h-2.5 w-2.5 rounded-full ${isSold ? "bg-red-500" : "bg-emerald-500"}`}></span>
                        </div>
                        
                        <div className="space-y-0.5">
                          <h4 className={`text-base sm:text-lg font-extrabold ${isSold ? "text-red-950 line-through opacity-80" : "text-green-950 group-hover:text-green-700"}`}>
                            {plotItem.name}
                          </h4>
                          <p className="text-xxs font-medium text-gray-500">
                            {isSold ? "This plot size is fully booked/sold out" : "Ready for Registration & Booking"}
                          </p>
                        </div>

                        <div className={`pt-2 border-t text-xs font-bold flex items-center justify-between ${
                          isSold ? "border-red-200 text-red-700" : "border-gray-100 text-green-700"
                        }`}>
                          <span>{isSold ? "SOLD OUT 🚫" : "Available"}</span>
                          {!isSold && <span className="group-hover:translate-x-0.5 transition">&rarr;</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Call to Action Bar */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-gray-150">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>
                      {isProjectDeliveredOrSoldOut
                        ? "This project is fully delivered or sold out."
                        : "You can select single or multiple plot sizes during booking."}
                    </span>
                  </div>

                  {isProjectDeliveredOrSoldOut ? (
                    <button
                      disabled
                      className="w-full sm:w-auto bg-red-100 text-red-800 border border-red-300 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl cursor-not-allowed text-center shrink-0 opacity-80"
                    >
                      ALL PLOTS SOLD OUT 🚫
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
                    >
                      <CalendarCheck className="h-4.5 w-4.5 text-amber-300" />
                      Book Site Visit / Select Plot &rarr;
                    </button>
                  )}
                </div>
              </div>
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
          <div className="text-xl font-bold text-white tracking-wide">Greenleaf Holdings Ltd.</div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition">Terms of Service</a>
            <a href="/contact" className="hover:text-amber-400 transition">Contact Us</a>
          </div>
          <div className="text-sm text-center md:text-right text-green-100/50">
            &copy; {new Date().getFullYear()} Greenleaf Holdings Ltd.. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Booking Scheduling Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPlot={project.title}
        availablePlots={plotsList}
      />
    </div>
  );
}
