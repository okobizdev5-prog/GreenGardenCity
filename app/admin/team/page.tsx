"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  User, 
  Search,
  X,
  Briefcase
} from "lucide-react";
import { 
  getTeamAction, 
  createTeamMemberAction, 
  deleteTeamMemberAction 
} from "@/app/actions/teamActions";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
};

export default function TeamAdmin() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchTeam = async () => {
    const res = await getTeamAction();
    if (res.success && res.data) {
      setTeam(res.data as TeamMember[]);
    }
  };

  useEffect(() => {
    fetchTeam();
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

    const res = await createTeamMemberAction({
      name,
      role,
      imageUrl,
    });

    if (res.success) {
      setIsModalOpen(false);
      resetForm();
      fetchTeam();
    } else {
      alert(res.error || "Failed to add team member.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team member?")) {
      const res = await deleteTeamMemberAction(id);
      if (res.success) fetchTeam();
    }
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setFile(null);
  };

  const filteredTeam = team.filter((m) => {
    return (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Team Manager</h2>
          <p className="text-gray-500 text-sm">Add and manage profiles of community builders and architects.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95 shadow-sm"
        >
          <Plus className="h-5 w-5" /> Add Member
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
              placeholder="Search team members by name or role..." 
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
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Avatar</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Professional Role</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 w-24">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="h-10 w-10 object-cover rounded-full border border-gray-100" />
                    ) : (
                      <div className="h-10 w-10 bg-gray-50 flex items-center justify-center rounded-full border border-gray-150">
                        <User className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <p className="font-bold text-gray-950 text-sm">{member.name}</p>
                  </td>
                  <td className="p-4 align-middle text-sm">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-md">
                      <Briefcase className="h-3 w-3" /> {member.role}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button 
                      onClick={() => handleDelete(member.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-55 hover:text-red-700 rounded-lg transition"
                      title="Delete Member"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTeam.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No team members found. Click "Add Member" to build your bento team.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-700"></div>
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Team Member</h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish profile to the public About Us team grid.</p>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. Elena Rostova"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Role</label>
                <input 
                  type="text" 
                  required 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="rounded-lg border-gray-200 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition py-2 px-3.5 text-sm font-medium text-gray-700" 
                  placeholder="e.g. Chief Architect"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Headshot Image</label>
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
                  {isLoading ? "Saving..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
