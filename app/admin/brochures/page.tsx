"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Globe, 
  Search,
  X,
  FileText,
  Paperclip,
  Download
} from "lucide-react";
import { 
  getBrochuresAction, 
  createBrochureAction, 
  deleteBrochureAction 
} from "@/app/actions/brochureActions";

type Brochure = {
  id: string;
  title: string;
  description: string;
  size: string;
  languages: string;
  imageUrl: string | null;
  pdfUrl: string | null;
};

export default function BrochureAdmin() {
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("5.0 MB");
  const [languages, setLanguages] = useState("English, Bengali");
  const [pdfUrl, setPdfUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchBrochures = async () => {
    const res = await getBrochuresAction();
    if (res.success && res.data) {
      setBrochures(res.data as Brochure[]);
    }
  };

  useEffect(() => {
    fetchBrochures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }
    }

    const res = await createBrochureAction({
      title,
      description,
      size,
      languages,
      imageUrl,
      pdfUrl: pdfUrl || "/brochures/placeholder.jpg",
    });

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      fetchBrochures();
    } else {
      alert(res.error || "Failed to create brochure.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brochure listing?")) {
      const res = await deleteBrochureAction(id);
      if (res.success) fetchBrochures();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSize("5.0 MB");
    setLanguages("English, Bengali");
    setPdfUrl("");
    setFile(null);
  };

  const filteredBrochures = brochures.filter((b) => {
    return (
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.languages.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Brochures Manager</h2>
          <p className="text-gray-500 text-sm">Upload digital catalogs, mapping details, and amenity sheets.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95 shadow-sm"
        >
          <Plus className="h-5 w-5" /> Add Brochure
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Search controls */}
        <div className="p-5 border-b border-gray-100 flex items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search brochures by title..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Cover Image</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Brochure Title</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Languages</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">JPG Path</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBrochures.map((brochure) => (
                <tr key={brochure.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 w-24">
                    {brochure.imageUrl ? (
                      <img src={brochure.imageUrl} alt={brochure.title} className="h-12 w-10 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="h-12 w-10 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-150">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <p className="font-bold text-gray-950 text-sm">{brochure.title}</p>
                    <p className="text-xxs text-gray-400 mt-1 line-clamp-1 max-w-[260px]" title={brochure.description}>
                      {brochure.description}
                    </p>
                  </td>
                  <td className="p-4 align-middle text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5 font-medium text-xs">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      {brochure.languages}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-sm text-green-700">
                    <span className="inline-flex items-center gap-1 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-md">
                      <Paperclip className="h-3 w-3" />
                      {brochure.pdfUrl || "placeholder.jpg"}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button 
                      onClick={() => handleDelete(brochure.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-55 hover:text-red-700 rounded-lg transition"
                      title="Delete Brochure"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBrochures.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No brochures found. Click "Add Brochure" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Brochure Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-700"></div>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Brochure</h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish document PDFs for client download.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brochure Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. Master Plan Brochure"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea 
                  required 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={3}
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700 resize-none" 
                  placeholder="e.g. Dimensions and structural blueprints..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Size (e.g. 5.2 MB)</label>
                  <input 
                    type="text" 
                    required 
                    value={size} 
                    onChange={e => setSize(e.target.value)} 
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                    placeholder="e.g. 5.2 MB"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Languages</label>
                  <input 
                    type="text" 
                    required 
                    value={languages} 
                    onChange={e => setLanguages(e.target.value)} 
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                    placeholder="e.g. English, Bengali"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">JPG File Path / Download Link</label>
                <input 
                  type="text" 
                  value={pdfUrl} 
                  onChange={e => setPdfUrl(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. /brochures/layout.jpg"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brochure Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setFile(e.target.files?.[0] || null)} 
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); resetForm(); }} 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Brochure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
