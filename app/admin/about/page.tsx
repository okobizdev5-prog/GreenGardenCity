"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Edit,
  Info,
  Check,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";
import {
  getAboutEntriesAction,
  createAboutAction,
  updateAboutAction,
  deleteAboutAction,
  setActiveAboutAction,
  AboutData
} from "@/app/actions/aboutActions";
import RichTextEditor from "@/components/RichTextEditor";

const isVideo = (url?: string) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes("/uploads/video") || url.includes("video");
};

const emptyAboutState: AboutData = {
  badge: "About Our Vision",
  title: "A Glimpse into Sustainable Luxury",
  desc1: "Green Garden City is carefully crafted to offer a highly secure, pollution-free, and natural living environment. Our community is designed with premium infrastructure and modern layouts, catering to families seeking luxury coupled with green surroundings.",
  desc2: "",
  stat1Num: "100+",
  stat1Label: "Happy Plot Buyers",
  stat2Num: "40%",
  stat2Label: "Dedicated Greenery & Lakes",
  mediaUrl: "/vision_image.png",
  isActive: true,
};

export default function AboutManager() {
  const [entries, setEntries] = useState<AboutData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AboutData | null>(null);
  const [formData, setFormData] = useState<AboutData>(emptyAboutState);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchEntries = async () => {
    setIsLoading(true);
    const res = await getAboutEntriesAction();
    if (res.success && res.data) {
      setEntries(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({ ...emptyAboutState });
    setIsModalOpen(true);
  };

  const openEditModal = (entry: AboutData) => {
    setEditingEntry(entry);
    setFormData({ ...entry });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ ...emptyAboutState });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData(prev => ({ ...prev, mediaUrl: data.url }));
      } else {
        alert("Failed to upload media file.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading media file.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Please enter a section title.");

    setIsSaving(true);

    let res;
    if (editingEntry && editingEntry.id) {
      res = await updateAboutAction(editingEntry.id, formData);
    } else {
      res = await createAboutAction(formData);
    }

    if (res.success) {
      setToastMessage(editingEntry ? "About entry updated successfully!" : "New About entry created successfully!");
      setTimeout(() => setToastMessage(null), 4000);
      closeModal();
      fetchEntries();
    } else {
      alert(res.error || "Failed to save entry.");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this About entry?")) {
      const res = await deleteAboutAction(id);
      if (res.success) {
        setToastMessage("About entry deleted!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchEntries();
      } else {
        alert(res.error || "Failed to delete entry.");
      }
    }
  };

  const handleSetActive = async (id: string) => {
    const res = await setActiveAboutAction(id);
    if (res.success) {
      setToastMessage("Active entry updated!");
      setTimeout(() => setToastMessage(null), 4000);
      fetchEntries();
    } else {
      alert(res.error || "Failed to set active entry.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-green-800 font-bold">
          <Loader2 className="h-6 w-6 animate-spin text-green-700" />
          <span>Loading About Sections...</span>
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
            <Info className="h-8 w-8 text-green-700" />
            About Vision Manager
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage the content, stats, and background media for the homepage 'About Our Vision' section.</p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 text-sm shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" /> Add New About Version
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Saved About Versions ({entries.length})
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entries.map((entry, index) => (
            <div
              key={entry.id || index}
              className={`bg-white rounded-2xl border ${
                entry.isActive ? "border-green-500 ring-2 ring-green-100" : "border-gray-200"
              } shadow-xs overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition duration-200`}
            >
              {/* Media Thumbnail */}
              <div className="h-48 md:h-auto md:w-56 bg-gray-950 relative overflow-hidden shrink-0">
                {entry.mediaUrl ? (
                  isVideo(entry.mediaUrl) ? (
                    <video
                      src={entry.mediaUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <img
                      src={entry.mediaUrl}
                      alt="About Media"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )
                ) : (
                  <img
                    src="/vision_image.png"
                    alt="Default About Media"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                
                {entry.isActive && (
                  <span className="absolute top-3 left-3 bg-green-600/90 text-white text-xxs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-20 shadow-sm border border-green-500">
                    Active on Site
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      {entry.badge}
                    </span>
                  </div>
                  <h4 className="text-gray-900 font-extrabold text-lg line-clamp-1">
                    {entry.title}
                  </h4>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                    {entry.desc1 ? entry.desc1.replace(/<[^>]*>/g, "") : ""}
                  </p>

                  {/* Stats Display */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-150">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-green-700" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">{entry.stat1Num}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[100px]">{entry.stat1Label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-green-700" />
                      <div>
                        <p className="text-xs font-bold text-gray-800">{entry.stat2Num}</p>
                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[100px]">{entry.stat2Label}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(entry)}
                      className="flex-1 py-1.5 px-3 border border-gray-200 hover:border-green-600 hover:bg-green-50 text-gray-700 hover:text-green-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>

                    {!entry.isActive && entry.id && (
                      <button
                        type="button"
                        onClick={() => handleSetActive(entry.id!)}
                        className="py-1.5 px-3 bg-green-50 border border-green-200 text-green-800 hover:bg-green-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Check className="h-3.5 w-3.5" /> Go Active
                      </button>
                    )}
                  </div>

                  {!entry.isActive && entry.id && (
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id!)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-gray-100 flex flex-col max-h-[92vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-700"></div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingEntry ? "Edit About Vision Content" : "Add New About Vision Content"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Customize descriptions, stats values, and active media for this layout.</p>
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
              {/* Media Preview block */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-400 tracking-wider block uppercase">Illustration Preview</span>
                <div className="relative min-h-[220px] rounded-xl overflow-hidden border border-gray-300 bg-gray-950 flex items-center justify-center shadow-md">
                  {formData.mediaUrl ? (
                    isVideo(formData.mediaUrl) ? (
                      <video
                        src={formData.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    ) : (
                      <img
                        src={formData.mediaUrl}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />
                    )
                  ) : (
                    <span className="text-gray-400 text-xs relative z-10">No illustration media selected</span>
                  )}
                  <div className="absolute inset-0 bg-black/10 z-10"></div>
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Badge Tagline</label>
                  <input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="e.g. About Our Vision"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Section Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="e.g. A Glimpse into Sustainable Luxury"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Description</label>
                <RichTextEditor
                  value={formData.desc1}
                  onChange={val => setFormData({ ...formData, desc1: val })}
                  placeholder="Enter section description..."
                />
              </div>

              {/* Statistics Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-150">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-green-800 block uppercase">Stat Item 1</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.stat1Num}
                      onChange={e => setFormData({ ...formData, stat1Num: e.target.value })}
                      className="col-span-1 rounded-lg border-gray-200 border bg-white py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="e.g. 100+"
                    />
                    <input
                      type="text"
                      required
                      value={formData.stat1Label}
                      onChange={e => setFormData({ ...formData, stat1Label: e.target.value })}
                      className="col-span-2 rounded-lg border-gray-200 border bg-white py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Label (e.g. Happy Plot Buyers)"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-green-800 block uppercase">Stat Item 2</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.stat2Num}
                      onChange={e => setFormData({ ...formData, stat2Num: e.target.value })}
                      className="col-span-1 rounded-lg border-gray-200 border bg-white py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="e.g. 40%"
                    />
                    <input
                      type="text"
                      required
                      value={formData.stat2Label}
                      onChange={e => setFormData({ ...formData, stat2Label: e.target.value })}
                      className="col-span-2 rounded-lg border-gray-200 border bg-white py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Label (e.g. Dedicated Greenery & Lakes)"
                    />
                  </div>
                </div>
              </div>

              {/* Media File Selector / Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Background Illustration Media (Image or Video)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="text"
                    value={formData.mediaUrl}
                    onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                    className="flex-1 rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                    placeholder="/vision_image.png or /uploads/... or https://..."
                  />
                  <label className="relative cursor-pointer bg-green-50 hover:bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg border border-green-200 flex items-center justify-center gap-2 text-xs transition shrink-0">
                    <ImageIcon className="h-4 w-4 text-green-700" />
                    <span>Upload Media</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
                {isUploading && (
                  <p className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading media...
                  </p>
                )}
              </div>

              {/* Active Toggle Option */}
              <div className="flex items-center gap-2 pl-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-green-700 focus:ring-green-500 h-5 w-5"
                  />
                  <span className="text-sm font-semibold text-gray-700">Set Active on Site</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
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
                  {editingEntry ? "Save Content" : "Create About Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
