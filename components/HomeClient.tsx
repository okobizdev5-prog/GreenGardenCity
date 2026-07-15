"use client";

import { useState } from "react";
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

type HomeClientProps = {
  initialProjects: Project[];
};

export function HomeClient({ initialProjects }: HomeClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlotSize, setSelectedPlotSize] = useState("3 Katha");

  const handleBookVisit = (plotSize: string = "3 Katha") => {
    setSelectedPlotSize(plotSize);
    setIsBookingOpen(true);
  };

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

      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/hero_background.png')" }}
      >
        {/* Dark overlay with green tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-950/80 via-green-900/60 to-black/50 z-0"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-800/60 border border-green-700/50 backdrop-blur-md text-xs font-semibold tracking-wider text-green-200 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              100% Gated & Secure Eco-City
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Discover the Future of <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-amber-300">
                Urban Living
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light">
              Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Green Garden City.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={() => handleBookVisit("Not Sure")}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-green-900/40 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <CalendarDays className="h-5 w-5 text-green-200" />
                Book a Site Visit
              </button>
              <a 
                href="#plots"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold px-8 py-4 rounded-lg transition text-center flex items-center justify-center gap-2"
              >
                Explore Plots
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Info Panel */}
          <div className="lg:col-span-4 lg:block">
            <div className="glass-panel p-6 rounded-2xl border border-white/20 text-gray-900 shadow-2xl max-w-sm mx-auto space-y-6">
              <h3 className="text-lg font-bold text-green-900 border-b border-green-950/10 pb-3 flex items-center gap-2">
                <Compass className="h-5 w-5 text-green-700" /> Key Highlights
              </h3>
              <ul className="space-y-4 text-sm text-gray-700 font-medium">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  <span>Immediate Plot Registration</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  <span>Electricity & Gas Connections Ready</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  <span>15 Mins Drive from Hazrat Shahjalal Airport</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  <span>Flexible Installment Plans Available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
              Green Garden City is carefully crafted to offer a highly secure, pollution-free, and natural living environment. Our community is designed with premium infrastructure and modern layouts, catering to families seeking luxury coupled with green surroundings.
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
                alt="Green Garden City Vision" 
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

      {/* Plot Listings Section */}
      <section id="plots" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mb-16 space-y-4">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Plot configurations</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight">
            Available Land Plots
          </h2>
          <p className="text-gray-600">
            Select a plot configuration that fits your dream project. Book a site visit to view the physical land mapping.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialProjects.map((project) => (
            <div 
              key={project.id} 
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${
                project.status === "Sold Out" ? "opacity-95" : ""
              }`}
            >
              {/* Plot Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    onError={(e) => {
                      // Fallback in case of image load error
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Trees className="h-12 w-12 text-gray-300 mb-2" />
                    <span className="text-xs">No image uploaded</span>
                  </div>
                )}
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

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
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
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Connectivity</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight leading-tight">
              Strategic Location
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Located in the heart of upcoming urban planning, Green Garden City boasts prime connectivity to key areas of the capital city. Access major national highways and transport systems in minutes.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-green-50 text-green-700 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Key Distance Landmarks</h4>
                  <p className="text-sm text-gray-500">15 Mins from Shahjalal Airport, 10 Mins from Bypass Highway, 5 Mins from nearest Metro Station.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-green-50 text-green-700 rounded-full flex items-center justify-center">
                  <Road className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Access Road Infrastructure</h4>
                  <p className="text-sm text-gray-500">Connected with a 100ft wide main access road linking directly to the commercial zone.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-md">
              <img 
                src="/route_map.png" 
                alt="Green Garden City Route Map" 
                className="w-full rounded-lg object-contain aspect-[4/3] bg-white border border-gray-200" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-gray-300 pt-16 pb-8 border-t border-green-900">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white tracking-wide">Green Garden City</h3>
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
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>info@greengardencity.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Sector-15, Uttara, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 md:px-8 border-t border-green-900/60 pt-8 text-center text-xs text-green-100/40">
          <p>&copy; {new Date().getFullYear()} Green Garden City Ltd. All rights reserved. Designed for elite living.</p>
        </div>
      </footer>

      {/* Booking Scheduling Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialPlot={selectedPlotSize}
      />
    </div>
  );
}
