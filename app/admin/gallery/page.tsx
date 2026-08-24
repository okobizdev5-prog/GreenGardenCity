"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Upload,
  X
} from "lucide-react";
import {
  getGalleryItemsAction,
  createGalleryItemAction,
  deleteGalleryItemAction,
  GalleryItemData
} from "@/app/actions/galleryActions";

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    const res = await getGalleryItemsAction();
    if (res.success && res.data) {
      setItems(res.data as GalleryItemData[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setTitle("Green Garden City");
    setFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image file to upload.");

    setIsSaving(true);
    setIsUploading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image file to host.");
      }

      const uploadResult = await uploadRes.json();
      const imageUrl = uploadResult.url;

      const res = await createGalleryItemAction({
        title: title.trim() || "Green Garden City",
        imageUrl,
      });

      if (res.success) {
        setToastMessage("Gallery photo added successfully!");
        setTimeout(() => setToastMessage(null), 4000);
        closeModal();
        fetchItems();
      } else {
        alert(res.error || "Failed to save gallery item.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error uploading and saving gallery item.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo from the gallery?")) {
      const res = await deleteGalleryItemAction(id);
      if (res.success) {
        setToastMessage("Photo deleted from gallery!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchItems();
      } else {
        alert(res.error || "Failed to delete item.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-green-800 font-bold">
          <Loader2 className="h-6 w-6 animate-spin text-green-700" />
          <span>Loading Gallery Photos...</span>
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
            <ImageIcon className="h-8 w-8 text-green-700" />
            Photo Gallery Manager
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage the high-resolution landscape and environment photos showcased in the homepage gallery.</p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 text-sm shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" /> Add New Photo
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-semibold text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Saved Gallery Photos ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No photos in the gallery yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 text-sm text-green-700 font-bold hover:underline"
            >
              Upload your first photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden group hover:shadow-md transition duration-200 flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div className="aspect-video sm:aspect-square bg-gray-100 relative overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition duration-300 z-10 flex items-center justify-center p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id!)}
                      className="p-3 bg-red-600 hover:bg-red-750 text-white rounded-full transition transform hover:scale-110 shadow-lg cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-3.5 bg-white border-t border-gray-50 flex items-center justify-between gap-2 flex-1">
                  <p className="text-gray-800 font-bold text-xs truncate" title={item.title}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-gray-100 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-700"></div>

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/70 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Photo to Gallery</h3>
                <p className="text-xs text-gray-500 mt-0.5">Showcase high-resolution environment layout photos.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Photo Input / Preview Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Select Photo</label>
                {previewUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-300 bg-gray-950 flex items-center justify-center shadow-inner group">
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-green-600 hover:bg-green-50/20 rounded-xl aspect-video flex flex-col items-center justify-center p-6 cursor-pointer transition group shadow-sm bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-green-700 mb-2 transition" />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-green-800 transition">Click to upload photo</span>
                    <span className="text-xxs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              {/* Title Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Photo Tagline / Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition py-2 px-3 text-sm font-medium text-gray-800"
                  placeholder="e.g. Eco Park & Lake View"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition flex items-center gap-1.5 disabled:opacity-50 text-sm cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Upload Photo"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
