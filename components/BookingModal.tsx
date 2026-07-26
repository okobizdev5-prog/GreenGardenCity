"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Check, Compass, Building, Store } from "lucide-react";

import { PlotObject, normalizePlotObject } from "@/lib/projectUtils";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialPlot?: string;
  availablePlots?: (string | PlotObject)[];
};

type ProjectBrief = {
  id: string;
  title: string;
  availablePlots: PlotObject[];
};

export function BookingModal({
  isOpen,
  onClose,
  initialPlot = "General Inquiry",
  availablePlots: propAvailablePlots,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
  });
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState<string>(initialPlot);
  const [selectedPlotSizes, setSelectedPlotSizes] = useState<string[]>([]);
  const [landPurpose, setLandPurpose] = useState<"Residential" | "Commercial" | "Garden House">("Residential");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Default fallback plot options if project has no custom plots defined
  const defaultPlotOptions: PlotObject[] = [
    { name: "3 Katha", isSoldOut: false },
    { name: "5 Katha", isSoldOut: false },
    { name: "10 Katha", isSoldOut: false },
  ];

  useEffect(() => {
    if (isOpen) {
      setSelectedProjectTitle(initialPlot);
      if (propAvailablePlots && propAvailablePlots.length > 0) {
        const normalizedProps = propAvailablePlots.map(normalizePlotObject);
        const firstAvailable = normalizedProps.find((p) => !p.isSoldOut);
        setSelectedPlotSizes(firstAvailable ? [firstAvailable.name] : []);
      } else {
        setSelectedPlotSizes([]);
      }

      // Fetch active projects list to populate select options
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProjects(
              data.map((p) => {
                let plots: PlotObject[] = defaultPlotOptions;
                if (p.availablePlots && p.availablePlots.length > 0) {
                  plots = p.availablePlots.map(normalizePlotObject);
                } else if (p.description && p.description.includes("<!--PLOTS:")) {
                  const match = p.description.match(/<!--PLOTS:([\s\S]*?)-->/);
                  if (match && match[1]) {
                    try {
                      const parsed = JSON.parse(match[1]);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        plots = parsed.map(normalizePlotObject);
                      }
                    } catch (e) { }
                  }
                }
                return {
                  id: p.id,
                  title: p.title,
                  availablePlots: plots,
                };
              })
            );
          }
        })
        .catch((err) => console.error("Failed to load projects for booking modal:", err));
    }
  }, [isOpen, initialPlot, propAvailablePlots]);

  if (!isOpen) return null;

  // Compute active plots list for the currently selected project
  const activeProject = projects.find((p) => p.title === selectedProjectTitle);
  const currentPlotObjects: PlotObject[] =
    propAvailablePlots && propAvailablePlots.length > 0
      ? propAvailablePlots.map(normalizePlotObject)
      : activeProject
        ? activeProject.availablePlots
        : defaultPlotOptions;

  const togglePlotSelection = (plotItem: PlotObject) => {
    if (plotItem.isSoldOut) return;
    if (selectedPlotSizes.includes(plotItem.name)) {
      setSelectedPlotSizes(selectedPlotSizes.filter((p) => p !== plotItem.name));
    } else {
      setSelectedPlotSizes([...selectedPlotSizes, plotItem.name]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const plotsInfo = selectedPlotSizes.length > 0
      ? `Selected Plots: ${selectedPlotSizes.join(", ")}`
      : "";

    const formattedPlotString = selectedProjectTitle !== "General Inquiry"
      ? `${selectedProjectTitle} [Type: ${landPurpose}] ${plotsInfo ? `(${plotsInfo})` : ""}`.trim()
      : selectedProjectTitle;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        selectedPlot: formattedPlotString,
      }),
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
        });
        setSelectedPlotSizes([]);
      }, 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-green-950">Book a Site Visit / Plot</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select single or multiple plot options below.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900">Inquiry Received!</h3>
            <p className="text-gray-600 text-sm">Our representative will call you shortly to confirm your selected plot booking & physical tour.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm text-gray-800 bg-gray-50/50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Phone & Preferred Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm text-gray-800 bg-gray-50/50"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm text-gray-700 bg-gray-50/50"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm text-gray-800 bg-gray-50/50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Selected Project */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Select Project</label>
              <select
                className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white text-sm text-gray-800 font-semibold"
                value={selectedProjectTitle}
                onChange={(e) => {
                  setSelectedProjectTitle(e.target.value);
                  setSelectedPlotSizes([]);
                }}
              >
                <option value="General Inquiry">General Inquiry</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.title}>
                    {proj.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Purpose / Type Choice: Residential vs Commercial vs Garden House */}
            {selectedProjectTitle !== "General Inquiry" && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Land Category / Purpose (জমির ধরন)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLandPurpose("Residential")}
                    className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-extrabold transition flex flex-col items-center justify-center gap-1.5 ${landPurpose === "Residential"
                        ? "bg-green-700 border-green-800 text-white shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Building className="h-4.5 w-4.5" />
                    <span className="text-center">Residential</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLandPurpose("Commercial")}
                    className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-extrabold transition flex flex-col items-center justify-center gap-1.5 ${landPurpose === "Commercial"
                        ? "bg-green-700 border-green-800 text-white shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Store className="h-4.5 w-4.5" />
                    <span className="text-center">Commercial</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLandPurpose("Garden House")}
                    className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-extrabold transition flex flex-col items-center justify-center gap-1.5 ${landPurpose === "Garden House"
                        ? "bg-green-700 border-green-800 text-white shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Compass className="h-4.5 w-4.5" />
                    <span className="text-center">Garden House</span>
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Multi-Select Available Plots */}
            {selectedProjectTitle !== "General Inquiry" && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-green-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-green-700" /> Select Plot Options (Multiple Selection Allowed)
                  </label>
                  <span className="text-xxs font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    {selectedPlotSizes.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {currentPlotObjects.map((plotItem) => {
                    const isChecked = selectedPlotSizes.includes(plotItem.name);
                    const isSold = plotItem.isSoldOut;
                    return (
                      <button
                        key={plotItem.name}
                        type="button"
                        disabled={isSold}
                        onClick={() => togglePlotSelection(plotItem)}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${isSold
                            ? "bg-red-50 border-red-200 text-red-700 opacity-70 cursor-not-allowed"
                            : isChecked
                              ? "bg-green-700 border-green-800 text-white shadow-xs font-bold"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 font-medium"
                          }`}
                      >
                        <div className="flex flex-col min-w-0 pr-1">
                          <span className={`text-xs truncate ${isSold ? "line-through font-bold" : ""}`}>
                            {plotItem.name}
                          </span>
                          {isSold && <span className="text-[9px] font-extrabold text-red-600">SOLD OUT 🚫</span>}
                        </div>
                        <div
                          className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ml-1.5 ${isSold
                              ? "bg-red-100 border-red-300 text-red-600"
                              : isChecked
                                ? "bg-white text-green-800 border-white"
                                : "border-gray-300 bg-white"
                            }`}
                        >
                          {isChecked && !isSold && <Check className="h-3 w-3 stroke-3" />}
                          {isSold && <span className="text-[9px] font-bold text-red-700">×</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedPlotSizes.length > 0 && (
                  <p className="text-xxs text-gray-500 italic pt-1">
                    Selected plots: <span className="font-bold text-green-800">{selectedPlotSizes.join(", ")}</span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition shadow-md disabled:opacity-70 text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting Inquiry..." : "Confirm Schedule & Selected Plots"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
