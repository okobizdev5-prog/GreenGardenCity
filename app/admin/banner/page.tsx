"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Layout,
  ArrowRight,
  CalendarDays,
  Compass,
  Check,
  Edit,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import {
  getBannersAction,
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
  seedDefaultBannersAction,
  BannerData
} from "@/app/actions/bannerActions";

const isVideo = (url?: string) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes("/uploads/video") || url.includes("video");
};

const emptyBannerState: BannerData = {
  badgeText: "100% GATED & SECURE ECO-CITY",
  title: "Discover the Future of",
  highlightTitle: "Urban Living",
  subtitle: "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Green Garden City.",
  bgImage: "/hero_background.png",
  highlights: [
    "Immediate Plot Registration",
    "Electricity & Gas Connections Ready",
    "15 Mins Drive from Hazrat Shahjalal Airport",
    "Flexible Installment Plans Available"
  ],
  primaryBtnText: "Book a Site Visit",
  primaryBtnLink: "#booking",
  secondaryBtnText: "Explore Plots",
  secondaryBtnLink: "#plots",
  isActive: true,
};

export default function BannerManager() {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);
  const [formData, setFormData] = useState<BannerData>(emptyBannerState);

  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    const res = await getBannersAction();
    if (res.success && res.data) {
      setBanners(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ ...emptyBannerState });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: BannerData) => {
    setEditingBanner(banner);
    setFormData({
      ...banner,
      highlights: [...(banner.highlights || [])],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({ ...emptyBannerState });
    setNewHighlight("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        setFormData(prev => ({ ...prev, bgImage: data.url }));
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()]
    }));
    setNewHighlight("");
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index)
    }));
  };

  const handleUpdateHighlight = (index: number, val: string) => {
    const updated = [...formData.highlights];
    updated[index] = val;
    setFormData(prev => ({ ...prev, highlights: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Please enter a banner title.");

    setIsSaving(true);

    let res;
    if (editingBanner && editingBanner.id) {
      res = await updateBannerAction(editingBanner.id, formData);
    } else {
      res = await createBannerAction(formData);
    }

    if (res.success) {
      setToastMessage(editingBanner ? "Banner updated successfully!" : "New hero banner created successfully!");
      setTimeout(() => setToastMessage(null), 4000);
      closeModal();
      fetchBanners();
    } else {
      alert(res.error || "Failed to save banner.");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hero banner?")) {
      const res = await deleteBannerAction(id);
      if (res.success) {
        setToastMessage("Banner deleted!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchBanners();
      } else {
        alert(res.error || "Failed to delete banner.");
      }
    }
  };

  const handleSeed = async () => {
    if (confirm("Warning: This will clear existing banners and seed multiple sample hero banners. Continue?")) {
      setIsSeeding(true);
      const res = await seedDefaultBannersAction();
      if (res.success) {
        setToastMessage("Sample hero banners seeded successfully!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchBanners();
      } else {
        alert(res.error || "Failed to seed default banners.");
      }
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-green-800 font-bold">
          <Loader2 className="h-6 w-6 animate-spin text-green-700" />
          <span>Loading Hero Banners...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight flex items-center gap-2.5">
            <Layers className="h-8 w-8 text-green-700" />
            Hero Banners Manager
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage multiple slides & dynamic hero banners for the homepage carousel.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex-1 sm:flex-none border border-green-200 hover:bg-green-50 text-green-800 font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 text-sm shadow-xs disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-500" />}
            Seed Sample Banners
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 text-sm shadow-sm"
          >
            <Plus className="h-4.5 w-4.5" /> Add New Banner
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banners Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Active Hero Banner Slides ({banners.length})
          </h3>
          <span className="text-xs text-gray-400">Multiple banners will automatically rotate on the homepage slider</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div
              key={banner.id || index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:border-green-300 hover:shadow-md transition duration-200"
            >
              {/* Banner Cover Image/Video */}
              <div className="h-44 w-full bg-gray-900 relative p-4 flex flex-col justify-between overflow-hidden">
                {banner.bgImage ? (
                  isVideo(banner.bgImage) ? (
                    <video
                      src={banner.bgImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <img
                      src={banner.bgImage}
                      alt="Banner"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )
                ) : (
                  <img
                    src="/hero_background.png"
                    alt="Banner Default"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10"></div>

                <div className="relative z-20 flex justify-between items-start">
                  <span className="bg-green-800/80 backdrop-blur-md text-green-200 text-xxs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-600/50">
                    Slide #{index + 1}
                  </span>

                  <span className={`text-xxs font-bold px-2 py-1 rounded-md shadow-xs ${
                    banner.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="relative z-20 space-y-1">
                  <h4 className="text-white font-extrabold text-lg line-clamp-1">
                    {banner.title}
                  </h4>
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="text-xs text-gray-500 font-medium">
                  Media Path: <span className="text-gray-700 select-all break-all">{banner.bgImage || "None"}</span>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    className="flex-1 py-2 px-3 border border-gray-200 hover:border-green-600 hover:bg-green-50 text-gray-700 hover:text-green-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit Slide
                  </button>

                  {banners.length > 1 && banner.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(banner.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Slide Empty Card */}
          <button
            type="button"
            onClick={openAddModal}
            className="border-2 border-dashed border-gray-300 hover:border-green-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-green-700 bg-gray-50/50 hover:bg-green-50/20 transition min-h-[300px] group"
          >
            <div className="h-12 w-12 rounded-full bg-white border border-gray-200 group-hover:border-green-500 flex items-center justify-center text-gray-500 group-hover:text-green-700 shadow-xs transition">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm text-gray-700 group-hover:text-green-800">Add New Hero Banner Slide</span>
            <span className="text-xs text-gray-400 max-w-xs text-center">Create another dynamic slide with custom background image or video</span>
          </button>
        </div>

      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-gray-100 flex flex-col max-h-[92vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-700"></div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingBanner ? "Edit Hero Banner Slide" : "Add New Hero Banner Slide"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Customize text content, background images, and highlights for this banner slide.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Live Mini Preview Inside Modal */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Slide Preview</span>
                <div className="relative min-h-[220px] rounded-xl overflow-hidden border border-gray-300 bg-gray-950 flex items-center justify-center shadow-md">
                  {formData.bgImage ? (
                    isVideo(formData.bgImage) ? (
                      <video
                        src={formData.bgImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    ) : (
                      <img
                        src={formData.bgImage}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    )
                  ) : (
                    <span className="text-gray-400 text-xs relative z-10">No media uploaded</span>
                  )}
                  <div className="absolute inset-0 bg-black/15 z-10"></div>
                </div>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Slide Name / Reference</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="e.g. Waterfront Villa, Eco-City Banner, etc."
                  />
                </div>

                <div className="flex flex-col gap-1.5 justify-center pl-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-green-700 focus:ring-green-500 h-4.5 w-4.5"
                    />
                    <span className="text-sm font-semibold text-gray-700">Active Slide (Visible in Carousel)</span>
                  </label>
                </div>
              </div>

              {/* Background Media (Image or Video) Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Background Media (Image or Video)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="text"
                    value={formData.bgImage}
                    onChange={e => setFormData({ ...formData, bgImage: e.target.value })}
                    className="flex-1 rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="/hero_background.png or /uploads/... or https://..."
                  />
                  <label className="relative cursor-pointer bg-green-50 hover:bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg border border-green-200 flex items-center justify-center gap-2 text-xs transition shrink-0">
                    <ImageIcon className="h-4 w-4 text-green-700" />
                    <span>Upload Media</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading file...
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editingBanner ? "Save Slide Changes" : "Create Banner Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
