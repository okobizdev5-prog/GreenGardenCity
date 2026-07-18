"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  Inbox, 
  Headphones, 
  CalendarCheck,
  Download,
  Mail,
  Phone,
  Clock,
  ExternalLink
} from "lucide-react";
import { 
  getBookingsAction, 
  updateBookingStatusAction, 
  deleteBookingAction 
} from "@/app/actions/bookingActions";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  selectedPlot: string;
  status: string;
  createdAt: any;
};

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchBookings = async () => {
    const res = await getBookingsAction();
    if (res.success && res.data) {
      setBookings(res.data as any[]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this booking inquiry?")) {
      const res = await deleteBookingAction(id);
      if (res.success) fetchBookings();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await updateBookingStatusAction(id, status);
    if (res.success) fetchBookings();
  };

  // Calculate Stats
  const totalPending = bookings.filter(b => b.status === "Pending").length;
  const totalContacted = bookings.filter(b => b.status === "Contacted").length;
  const totalCancelled = bookings.filter(b => b.status === "Cancelled").length;

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.email && b.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.phone.includes(searchQuery) ||
      b.selectedPlot.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Inquiry & Booking Viewer</h2>
          <p className="text-gray-500 text-sm">Manage incoming site-visit prospects and track CRM statuses in real-time.</p>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Visits</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalPending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contacted Prospects</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalContacted}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cancelled / Suspended</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalCancelled}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition text-sm font-medium text-gray-700" 
              placeholder="Search by name, phone, or project..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["All", "Pending", "Contacted", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  filterStatus === status
                    ? "bg-green-50 text-green-800 border border-green-200/50 shadow-sm"
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Prospect Details</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Selected Project</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 align-top w-40 text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Visit Schedule
                    </p>
                  </td>
                  <td className="p-4 align-top text-sm space-y-1.5">
                    <p className="font-bold text-gray-900">{booking.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" /> {booking.phone}
                    </p>
                    {booking.email && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-400" /> {booking.email}
                      </p>
                    )}
                  </td>
                  <td className="p-4 align-top text-sm font-semibold text-gray-700">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md">
                      {booking.selectedPlot}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      booking.status === "Pending" 
                        ? "bg-amber-50 text-amber-800 border-amber-200/50" 
                        : booking.status === "Contacted" 
                        ? "bg-blue-50 text-blue-800 border-blue-200/50" 
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        booking.status === "Pending" ? "bg-amber-500" :
                        booking.status === "Contacted" ? "bg-blue-500" : "bg-gray-400"
                      }`}></span>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right space-x-1">
                    {booking.status !== "Contacted" && (
                      <button 
                        onClick={() => updateStatus(booking.id, "Contacted")} 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Mark Contacted"
                      >
                        <CheckCircle className="h-4.5 w-4.5" />
                      </button>
                    )}
                    {booking.status !== "Cancelled" && (
                      <button 
                        onClick={() => updateStatus(booking.id, "Cancelled")} 
                        className="p-1.5 text-gray-500 hover:bg-gray-150 rounded-lg transition"
                        title="Cancel Inquiries"
                      >
                        <XCircle className="h-4.5 w-4.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(booking.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 text-sm font-semibold">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
