"use client";

import { useState } from "react";
import { Download, Globe, CheckCircle, Compass } from "lucide-react";
import { Navbar } from "@/components/Navbar";

type Brochure = {
  id: string;
  title: string;
  description: string;
  size: string;
  languages: string;
  imageUrl: string | null;
  pdfUrl: string | null;
};

type BrochuresClientProps = {
  initialBrochures: Brochure[];
};

export function BrochuresClient({ initialBrochures }: BrochuresClientProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownload = (id: string, title: string, pdfUrl: string | null) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessMessage(`"${title}" downloaded successfully!`);
      
      // Simulate file download trigger
      if (pdfUrl) {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = pdfUrl.split("/").pop() || "brochure.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-16">
        
        {/* Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Document Center</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight">
            Project Brochures
          </h1>
          <p className="text-gray-600 text-lg font-light leading-relaxed">
            Explore the detailed vision, master plans, and exclusive features of Green Garden City. Download our comprehensive digital brochures to discover your future organic urban lifestyle.
          </p>
        </section>

        {/* Success Alert */}
        {successMessage && (
          <div className="max-w-md mx-auto bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Brochure Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialBrochures.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    src={item.imageUrl}
                    alt={item.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Compass className="h-16 w-16 mb-2" />
                    <span className="text-xs">No Cover Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <button
                    onClick={() => handleDownload(item.id, item.title, item.pdfUrl)}
                    disabled={downloadingId !== null}
                    className="bg-green-700 hover:bg-green-800 text-white font-semibold w-full py-3.5 rounded-lg flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    {downloadingId === item.id ? "Preparing PDF..." : "Download PDF"}
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      PDF
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{item.languages}</span>
                  </div>
                  <span className="font-semibold text-gray-400">{item.size}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

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
