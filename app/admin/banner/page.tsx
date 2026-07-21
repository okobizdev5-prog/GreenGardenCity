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

const emptyBannerState: BannerData = {
  badgeText: "100% GATED & SECURE ECO-CITY",
  title: "Discover the Future of",
  highlightTitle: "Urban Living",
  subtitle: "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Greenleaf Holdings Ltd..",
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
              {/* Banner Cover Image */}
              <div
                className="h-44 w-full bg-gray-900 bg-cover bg-center relative p-4 flex flex-col justify-between"
                style={{ backgroundImage: `url('${banner.bgImage || "/hero_background.png"}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-0"></div>

                <div className="relative z-10 flex justify-between items-start">
                  <span className="bg-green-800/80 backdrop-blur-md text-green-200 text-xxs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-green-600/50">
                    Slide #{index + 1}
                  </span>

                  <span className="bg-white/90 text-gray-800 text-xxs font-bold px-2 py-1 rounded-md shadow-xs">
                    {banner.badgeText || "ECO-CITY"}
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <h4 className="text-white font-extrabold text-lg line-clamp-1">
                    {banner.title} {banner.highlightTitle}
                  </h4>
                  <p className="text-gray-300 text-xs line-clamp-1 font-light">
                    {banner.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Key Highlights</span>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {(banner.highlights || []).slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="text-green-600 font-bold text-xxs">✓</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                    {(banner.highlights || []).length > 3 && (
                      <li className="text-xxs text-gray-400 font-semibold pl-3">
                        +{(banner.highlights || []).length - 3} more highlights
                      </li>
                    )}
                  </ul>
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
            <span className="text-xs text-gray-400 max-w-xs text-center">Create another dynamic slide with custom title, images, and highlights</span>
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
                <div
                  className="relative min-h-[220px] rounded-xl overflow-hidden border border-gray-300 bg-cover bg-center p-5 text-white flex items-center shadow-md"
                  style={{ backgroundImage: `url('${formData.bgImage || "/hero_background.png"}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-950/85 via-green-900/65 to-black/60 z-0"></div>

                  <div className="relative z-10 w-full space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-800/80 border border-green-600/50 text-[10px] font-bold text-green-200 uppercase">
                      {formData.badgeText || "100% GATED & SECURE ECO-CITY"}
                    </span>
                    <h4 className="text-xl font-extrabold tracking-tight">
                      {formData.title}{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-amber-300">
                        {formData.highlightTitle}
                      </span>
                    </h4>
                    <p className="text-xs text-gray-200 line-clamp-2 max-w-lg font-light">
                      {formData.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Badge Tagline</label>
                  <input
                    type="text"
                    required
                    value={formData.badgeText}
                    onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="e.g. 100% GATED & SECURE ECO-CITY"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Main Title Prefix</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="e.g. Discover the Future of"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Highlighted Title (Gradient)</label>
                <input
                  type="text"
                  required
                  value={formData.highlightTitle}
                  onChange={e => setFormData({ ...formData, highlightTitle: e.target.value })}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                  placeholder="e.g. Urban Living"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Subtitle / Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                  placeholder="Enter slide paragraph content..."
                />
              </div>

              {/* Background Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Background Image</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="text"
                    value={formData.bgImage}
                    onChange={e => setFormData({ ...formData, bgImage: e.target.value })}
                    className="flex-1 rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="/hero_background.png or https://..."
                  />
                  <label className="relative cursor-pointer bg-green-50 hover:bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg border border-green-200 flex items-center justify-center gap-2 text-xs transition shrink-0">
                    <ImageIcon className="h-4 w-4 text-green-700" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading image...
                  </p>
                )}
              </div>

              {/* Dynamic Key Highlights */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Key Highlights Bullet Points</label>

                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-green-100 text-green-700 font-bold text-xs">✓</span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={e => handleUpdateHighlight(index, e.target.value)}
                      className="flex-1 rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-1.5 px-3 text-xs font-medium text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={e => setNewHighlight(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                    className="flex-1 rounded-lg border-gray-200 border bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-1.5 px-3 text-xs font-medium text-gray-800"
                    placeholder="Add highlight item..."
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="bg-green-700 hover:bg-green-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Action Buttons Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-green-800 block uppercase">Primary Button</span>
                  <input
                    type="text"
                    value={formData.primaryBtnText}
                    onChange={e => setFormData({ ...formData, primaryBtnText: e.target.value })}
                    className="w-full rounded-lg border-gray-200 border bg-white py-1.5 px-3 text-xs font-medium"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={formData.primaryBtnLink}
                    onChange={e => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                    className="w-full rounded-lg border-gray-200 border bg-white py-1.5 px-3 text-xs font-medium"
                    placeholder="#booking link"
                  />
                </div>

                <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-700 block uppercase">Secondary Button</span>
                  <input
                    type="text"
                    value={formData.secondaryBtnText}
                    onChange={e => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                    className="w-full rounded-lg border-gray-200 border bg-white py-1.5 px-3 text-xs font-medium"
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    value={formData.secondaryBtnLink}
                    onChange={e => setFormData({ ...formData, secondaryBtnLink: e.target.value })}
                    className="w-full rounded-lg border-gray-200 border bg-white py-1.5 px-3 text-xs font-medium"
                    placeholder="#plots link"
                  />
                </div>
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
