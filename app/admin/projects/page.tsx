"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Layers, 
  Check, 
  Tag, 
  DollarSign,
  Search,
  X
} from "lucide-react";
import { 
  getProjectsAction, 
  createProjectAction, 
  deleteProjectAction 
} from "@/app/actions/projectActions";

type Project = {
  id: string;
  title: string;
  size: string;
  imageUrl: string | null;
  features: string;
  price: string | null;
  zone: string;
  status: string;
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("3 Katha");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [zone, setZone] = useState("Central Park");
  const [file, setFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    const res = await getProjectsAction();
    if (res.success && res.data) {
      setProjects(res.data as Project[]);
    }
  };

  useEffect(() => {
    fetchProjects();
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

    const res = await createProjectAction({
      title,
      size,
      imageUrl,
      features,
      price: price || null,
      zone,
      status: "Available",
    });

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } else {
      alert(res.error || "Failed to create project.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project plot listing?")) {
      const res = await deleteProjectAction(id);
      if (res.success) fetchProjects();
    }
  };

  const resetForm = () => {
    setTitle("");
    setSize("3 Katha");
    setFeatures("");
    setPrice("");
    setZone("Central Park");
    setFile(null);
  };

  // Filter project grid by search query
  const filteredProjects = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Projects Manager</h2>
          <p className="text-gray-500 text-sm">Manage inventory of active land offerings and plot layouts.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95 shadow-sm"
        >
          <Plus className="h-5 w-5" /> Add Land Plot
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Search controls */}
        <div className="p-5 border-b border-gray-100 flex items-center bg-white">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search plots by block, size, zone..." 
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
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Image</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Title / Name</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Size</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Price</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 w-28">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="h-12 w-20 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="h-12 w-20 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-150">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <p className="font-bold text-gray-950 text-sm">{project.title}</p>
                    <p className="text-xxs text-gray-400 mt-1 line-clamp-1 max-w-[200px]" title={project.features}>
                      {project.features}
                    </p>
                  </td>
                  <td className="p-4 align-middle text-sm font-semibold text-gray-700">{project.size}</td>
                  <td className="p-4 align-middle text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      {project.zone}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-sm font-bold text-green-700">{project.price || "-"}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                      project.status === "Available" 
                        ? "bg-green-50 text-green-700 border border-green-200/50" 
                        : "bg-red-50 text-red-700 border border-red-200/50"
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-55 hover:text-red-700 rounded-lg transition"
                      title="Delete Listing"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No projects found. Add a plot layout to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-700"></div>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Land Plot</h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish a new inventory listing to the main catalog.</p>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plot Title / Block Name (e.g. Block A - Plot 12)</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="Enter block & plot identifier"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plot Size</label>
                  <select 
                    value={size} 
                    onChange={e => setSize(e.target.value)}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                  >
                    <option value="3 Katha">3 Katha</option>
                    <option value="5 Katha">5 Katha</option>
                    <option value="10 Katha">10 Katha</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location Zone</label>
                  <select 
                    value={zone} 
                    onChange={e => setZone(e.target.value)}
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700"
                  >
                    <option value="Central Park">Central Park</option>
                    <option value="North Sector">North Sector</option>
                    <option value="South Sector">South Sector</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (e.g. 45 Lac BDT)</label>
                  <input 
                    type="text" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                    placeholder="e.g. 45 Lac BDT"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Plot Features (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={features} 
                    onChange={e => setFeatures(e.target.value)} 
                    className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                    placeholder="e.g. Lakeside View, Utilities Ready"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upload Plot Image</label>
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
                  {isLoading ? "Saving..." : "Save Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
