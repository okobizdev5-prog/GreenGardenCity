"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  X,
  Sparkles,
  Loader2,
  BookOpen,
  Edit3,
  Compass
} from "lucide-react";
import { 
  getProjectsAction, 
  createProjectAction, 
  updateProjectAction,
  deleteProjectAction,
  seedDefaultProjectsAction
} from "@/app/actions/projectActions";
import { RichTextEditor } from "@/components/RichTextEditor";
import { PlotObject, parsePlotsFromProject, normalizePlotObject } from "@/lib/projectUtils";

type Project = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  status: string;
  availablePlots?: (string | PlotObject)[];
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category] = useState("General");
  const [status] = useState("Ongoing");
  const [availablePlots, setAvailablePlots] = useState<PlotObject[]>([
    { name: "3 Katha", isSoldOut: false },
    { name: "5 Katha", isSoldOut: false },
    { name: "10 Katha", isSoldOut: false },
  ]);
  const [newPlotInput, setNewPlotInput] = useState("");

  const fetchProjects = async () => {
    const res = await getProjectsAction();
    if (res.success && res.data) {
      setProjects(res.data as Project[]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const data = await uploadRes.json();
          uploadedUrls.push(data.url);
        } else {
          console.error("Failed to upload image:", file.name);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages(uploadedUrls);
    setIsUploading(false);
    // Reset file input
    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setTitle(project.title);
    setDescription(project.description || "");
    setImages(project.images || []);
    setAvailablePlots(parsePlotsFromProject(project));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a project title.");
    if (!description.trim() || description === "<br>") return alert("Please add some project description details.");

    setIsLoading(true);

    let res;
    if (editingProjectId) {
      res = await updateProjectAction(editingProjectId, {
        title,
        description,
        images,
        category,
        status,
        availablePlots,
      });
    } else {
      res = await createProjectAction({
        title,
        description,
        images,
        category,
        status,
        availablePlots,
      });
    }

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } else {
      alert(res.error || "Failed to save project.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project? All associated details and image paths will be removed.")) {
      const res = await deleteProjectAction(id);
      if (res.success) fetchProjects();
    }
  };

  const handleSeed = async () => {
    if (confirm("Warning: This will clear ALL existing projects and reset to default premium projects. Do you want to continue?")) {
      setIsSeeding(true);
      const res = await seedDefaultProjectsAction();
      if (res.success) {
        alert("Projects database seeded successfully!");
        fetchProjects();
      } else {
        alert(res.error || "Seeding failed.");
      }
      setIsSeeding(false);
    }
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setTitle("");
    setDescription("");
    setImages([]);
    setAvailablePlots([
      { name: "3 Katha", isSoldOut: false },
      { name: "5 Katha", isSoldOut: false },
      { name: "10 Katha", isSoldOut: false },
    ]);
    setNewPlotInput("");
  };

  // Helper to safely strip HTML tags for summary snippet
  const getPlainText = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  };

  const filteredProjects = projects.filter((p) => {
    const textSnippet = getPlainText(p.description);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      textSnippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-green-700" />
            Projects Manager
          </h2>
          <p className="text-gray-500 text-sm">Manage construction projects, master plans, and residential developments.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex-1 sm:flex-none border border-green-200 hover:bg-green-50 text-green-800 font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-xs disabled:opacity-50"
            title="Seed Default Data"
          >
            {isSeeding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5 text-amber-500" />
            )}
            Seed Default Projects
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
          >
            <Plus className="h-5 w-5" /> Add Project
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Search controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search projects by title or content..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Images</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Project Title</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Description Summary</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 w-36">
                    <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300">
                      {project.images && project.images.length > 0 ? (
                        project.images.slice(0, 3).map((img, index) => (
                          <img 
                            key={index} 
                            src={img} 
                            alt={`Preview ${index}`} 
                            className="h-10 w-16 object-cover rounded-lg border-2 border-white shadow-xs shrink-0 bg-gray-100" 
                          />
                        ))
                      ) : (
                        <div className="h-10 w-16 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-150">
                          <ImageIcon className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                      {project.images && project.images.length > 3 && (
                        <div className="h-10 w-10 bg-gray-200 border-2 border-white text-gray-700 text-xxs font-bold flex items-center justify-center rounded-full shadow-xs shrink-0">
                          +{project.images.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="font-bold text-gray-950 text-sm">{project.title}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
                      {getPlainText(project.description)}
                    </p>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEditProject(project)} 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        title="Edit Project"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)} 
                        className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition"
                        title="Delete Project"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No projects found. Add a new project layout or seed default projects to get started.
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden relative border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-700"></div>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Project</h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish a master development blueprint project to the showcase catalog.</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); resetForm(); }} 
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2.5 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. Eco Lakeside Villas"
                />
              </div>



              {/* Available Plots / Plot Options */}
              <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-green-700" /> Available Plots / Plot Options (কাঠা বা প্লট নম্বর)
                  </label>
                  <span className="text-xxs text-gray-400">Add plot sizes or plot numbers for buyers to select</span>
                </div>

                {/* Quick Add Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xxs font-bold text-gray-500">Quick Add:</span>
                  {["3 Katha", "5 Katha", "10 Katha", "20 Katha"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (!availablePlots.some((p) => p.name.toLowerCase() === preset.toLowerCase())) {
                          setAvailablePlots([...availablePlots, { name: preset, isSoldOut: false }]);
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-gray-200 hover:border-green-500 hover:text-green-700 rounded-lg transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Plot Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newPlotInput}
                    onChange={(e) => setNewPlotInput(e.target.value)}
                    placeholder="e.g. Plot-101 (3 Katha), Shop-A, Flat-301..."
                    className="flex-1 rounded-lg border border-gray-200 bg-white py-2 px-3 text-xs font-medium focus:ring-2 focus:ring-green-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newPlotInput.trim() && !availablePlots.some((p) => p.name.toLowerCase() === newPlotInput.trim().toLowerCase())) {
                          setAvailablePlots([...availablePlots, { name: newPlotInput.trim(), isSoldOut: false }]);
                          setNewPlotInput("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPlotInput.trim() && !availablePlots.some((p) => p.name.toLowerCase() === newPlotInput.trim().toLowerCase())) {
                        setAvailablePlots([...availablePlots, { name: newPlotInput.trim(), isSoldOut: false }]);
                        setNewPlotInput("");
                      }
                    }}
                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs rounded-lg transition shrink-0"
                  >
                    Add Option
                  </button>
                </div>

                {/* Active Plots List with Sold Out Toggle */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {availablePlots.map((plotItem, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition text-xs font-bold ${
                        plotItem.isSoldOut
                          ? "bg-red-50 border-red-200 text-red-800"
                          : "bg-green-50 border-green-200 text-green-800"
                      }`}
                    >
                      <span>{plotItem.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...availablePlots];
                          updated[idx] = { ...updated[idx], isSoldOut: !updated[idx].isSoldOut };
                          setAvailablePlots(updated);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold transition ${
                          plotItem.isSoldOut
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-700 text-white hover:bg-green-800"
                        }`}
                        title="Click to toggle Available vs Sold Out status"
                      >
                        {plotItem.isSoldOut ? "SOLD OUT 🚫" : "AVAILABLE ✓"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailablePlots(availablePlots.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-600 font-bold ml-0.5 text-sm"
                        title="Remove Plot"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {availablePlots.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No plot options added yet.</span>
                  )}
                </div>
              </div>

              {/* Rich Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Description Details</label>
                <RichTextEditor value={description} onChange={setDescription} />
              </div>

              {/* Multiple Image Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Project Images (Upload Multiple)</label>
                
                {/* Upload Area */}
                <div className="relative border-2 border-dashed border-gray-200 hover:border-green-500 rounded-xl p-6 transition bg-gray-50/50 flex flex-col items-center justify-center gap-2 cursor-pointer group">
                  <input 
                    type="file" 
                    multiple
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="h-10 w-10 text-gray-400 group-hover:text-green-600 transition" />
                  <p className="text-xs font-semibold text-gray-600 group-hover:text-green-700">Click to select files or drag images here</p>
                  <p className="text-xxs text-gray-400">Supports PNG, JPG, WEBP (multiple uploads)</p>
                </div>

                {/* Upload Status */}
                {isUploading && (
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-green-700 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading images...</span>
                  </div>
                )}

                {/* Image Previews Queue */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative aspect-video w-full rounded-lg overflow-hidden group border border-gray-200 bg-white">
                        <img src={url} alt={`Upload preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 transition opacity-100 sm:opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sticky Action Footer inside Modal */}
              <div className="pt-5 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); resetForm(); }} 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || isUploading} 
                  className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? "Saving..." : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
