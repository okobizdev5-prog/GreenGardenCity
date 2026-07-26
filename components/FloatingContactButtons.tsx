"use client";

import { Phone, CalendarDays } from "lucide-react";

type FloatingContactButtonsProps = {
  onBookClick: () => void;
  phoneNumber?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
};

export function FloatingContactButtons({
  onBookClick,
  phoneNumber = "+8801898777431",
  whatsappNumber = "+8801898777431",
  whatsappMessage = "Hello Green Garden City, I am interested in your land projects and plot booking details.",
}: FloatingContactButtonsProps) {
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end">
      {/* 1. Book a Site Visit Button */}
      <div className="flex items-center group">
        <span className="mr-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0 backdrop-blur-xs hidden sm:block">
          সাইট ভিজিট বুকিং 🗓️
        </span>
        <button
          onClick={onBookClick}
          aria-label="Book a Site Visit"
          className="h-12 w-12 rounded-full bg-green-750 hover:bg-green-800 text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 relative border border-green-600 cursor-pointer"
        >
          <span className="absolute -inset-1 rounded-full bg-green-700/25 animate-ping pointer-events-none"></span>
          <CalendarDays className="h-5.5 w-5.5 text-amber-300 relative z-10" />
        </button>
      </div>

      {/* 2. WhatsApp Button */}
      <div className="flex items-center group">
        <span className="mr-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0 backdrop-blur-xs hidden sm:block">
          হোয়াটসঅ্যাপ চ্যাট 💬
        </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 relative"
        >
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/25 animate-ping pointer-events-none"></span>
          <svg className="h-5.5 w-5.5 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>

      {/* 3. Direct Call Button */}
      <div className="flex items-center group">
        <span className="mr-3 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-bold rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0 backdrop-blur-xs hidden sm:block">
          সরাসরি কল করুন 📞
        </span>
        <a
          href={`tel:${cleanPhone}`}
          aria-label="Call us directly"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 relative border border-blue-500"
        >
          <span className="absolute -inset-1 rounded-full bg-blue-600/25 animate-ping pointer-events-none"></span>
          <Phone className="h-5 w-5 text-white relative z-10" />
        </a>
      </div>
    </div>
  );
}
