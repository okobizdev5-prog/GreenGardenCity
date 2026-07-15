"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

type NavbarProps = {
  onBookClick?: () => void;
};

export function Navbar({ onBookClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Plot Pricing", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Brochures", href: "/brochures" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-gray-100" 
          : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center max-w-7xl">
        <Link href="/" className="font-bold text-2xl text-green-700 tracking-tight flex items-center gap-1 hover:opacity-90">
          Green Garden City
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  isActive 
                    ? "text-green-700 bg-green-50 font-bold" 
                    : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          {onBookClick ? (
            <button
              onClick={onBookClick}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5"
            >
              Book a Visit
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/contact"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95"
            >
              Book a Visit
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-green-700 p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-5 shadow-xl flex flex-col gap-3 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-semibold px-4 py-3 rounded-lg ${
                  isActive 
                    ? "text-green-700 bg-green-50" 
                    : "text-gray-700 hover:text-green-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          {onBookClick ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookClick();
              }}
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition"
            >
              Book a Visit
            </button>
          ) : (
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-green-700 text-white py-3.5 rounded-lg text-center font-bold mt-2 shadow-md hover:bg-green-800 active:scale-95 transition"
            >
              Book a Visit
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

