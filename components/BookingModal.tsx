"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";


type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPlot?: string;
};

export function BookingModal({ isOpen, onClose, initialPlot = "3 Katha" }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    selectedPlot: initialPlot,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        selectedPlot: initialPlot,
      }));
    }
  }, [isOpen, initialPlot]);

  if (!isOpen) return null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          name: "",
          phone: "",
          email: "",
          date: "",
          selectedPlot: "3 Katha",
        });
      }, 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-green-900">Book a Site Visit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">Request Received!</h3>
            <p className="text-gray-600">Our team will contact you shortly to confirm your visit schedule.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-700"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interested Plot Size</label>
              <select
                className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
                value={formData.selectedPlot}
                onChange={(e) => setFormData({ ...formData, selectedPlot: e.target.value })}
              >
                <option value="3 Katha">3 Katha</option>
                <option value="5 Katha">5 Katha</option>
                <option value="10 Katha">10 Katha</option>
                <option value="Not Sure">Not Sure Yet</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 text-white font-medium py-3 rounded-lg hover:bg-green-800 transition shadow-md disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
