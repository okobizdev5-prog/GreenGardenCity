"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, ArrowRight, Compass } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { createBookingAction } from "@/app/actions/bookingActions";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "Residential Plots",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Save inquiry to MongoDB via Server Action
    const res = await createBookingAction({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email || null,
      date: new Date().toISOString().split("T")[0], // Set default today
      selectedPlot: `${formData.interest}: ${formData.message}`.slice(0, 100), // Map interest/message
    });

    if (res.success) {
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "Residential Plots",
        message: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(res.error || "Failed to submit request.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 space-y-16">
        
        {/* Header */}
        <section className="text-center md:text-left max-w-3xl space-y-4">
          <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Connect With Us</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 tracking-tight leading-tight">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed">
            We're here to help you find your perfect plot. Reach out for inquiries, scheduling a visit, or any questions about Green Garden City.
          </p>
        </section>

        {/* Form and info Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inquiry form */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2">
                Book a Visit
              </h2>
              <p className="text-gray-500 text-sm">Fill out the form below and our sales team will contact you to schedule a physical tour of the plots.</p>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                <span className="text-sm font-semibold">Your visit request has been submitted successfully! We will call you soon.</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-3">
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="firstName">First Name</label>
                  <input
                    required
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700"
                    id="firstName"
                    placeholder="Enter first name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="lastName">Last Name</label>
                  <input
                    required
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700"
                    id="lastName"
                    placeholder="Enter last name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="email">Email Address</label>
                  <input
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700"
                    id="email"
                    placeholder="your@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="phone">Phone Number</label>
                  <input
                    required
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700"
                    id="phone"
                    placeholder="Phone number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="interest">I am interested in</label>
                <select
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                >
                  <option value="Residential Plots">Residential Plots</option>
                  <option value="Commercial Plots">Commercial Plots</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="message">Message</label>
                <textarea
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700 resize-none"
                  id="message"
                  placeholder="Tell us how we can help..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Send Request"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Info details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-green-900 border-b border-gray-100 pb-3">Contact Information</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-full text-green-700 shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Head Office</p>
                    <p className="text-gray-500">Green Garden City, Kaliganj, Gazipur</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-full text-green-700 shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-500">01898777431</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-full text-green-700 shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-green-700 font-medium">greengardencitypurbachal@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-full text-green-700 shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Office Hours</p>
                    <p className="text-gray-500">Saturday - Thursday<br />9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side visual Image */}
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100 border border-gray-100">
              <img 
                alt="Green Garden City Office" 
                className="w-full h-full object-cover hover:scale-103 transition duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrcsfqVe2Pu0z4W7z2WZVNbZ6bqHragKWIg0bekyZ2M-0MC8B3vYaNpOrZcPfD0C_jWJYHgaiP3gFqfYNwUYZmh-YW3x3-pbenu8QYo08DR5maIHnlCmg_6_e2hVBEMr1q831gwsOQwFZlDJCUoxi9u09FqemBNbs-HAfF3B-f_okl2-uu-nzOEuRKNB4j7R-vyhA-35aTHd5UsoQ8yct3mJX70CwFp9iy3mGQoXx1aWYC9b2TT4xd4cQlQDlLSM6qig" 
              />
            </div>
          </div>
        </section>

        {/* Map Representation */}
        <section className="w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-gray-200/60 relative">
          <img 
            className="w-full h-full object-cover" 
            alt="Eco District Sales Center Map" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5OjrrdT6mgctFErq7pDSLa_foE9a00W_7xH7hERaFPF5951eKEuC_4HWtKGWPhVWxAMwERrCmYNZCyPNwEbRU2T27554RuBZ8v2SBJ5eiE0qy2L9SUMFv5ZxnXKnFdWtcoDlxoKqqIlvsU6av3nqzkae0JCCNMfo3SXJN0dkMAtf2vT36Vr3r5p4zWRv-qH6Rn4Xh4lTzWyD3CIJ3-3UBp5NSXwrcmMzsXe08RBPIJDGBoXDX_rRM" 
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl flex flex-col items-center pointer-events-auto border border-green-700/10">
              <Compass className="h-10 w-10 text-amber-500 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-green-950 text-center leading-tight">
                Green Garden City<br />
                <span className="text-xs text-gray-500 font-semibold">Sales & Information Center</span>
              </p>
            </div>
          </div>
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
