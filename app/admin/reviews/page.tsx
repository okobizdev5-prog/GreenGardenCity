"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import {
  getReviewsAction,
  deleteReviewAction,
  seedDefaultReviewsAction
} from "@/app/actions/reviewActions";

type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string | Date;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    const res = await getReviewsAction();
    if (res.success && res.data) {
      setReviews(res.data as Review[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);


  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      setIsActionLoading(true);
      const res = await deleteReviewAction(id);
      if (res.success) {
        fetchReviews();
      } else {
        alert(res.error || "Failed to delete review.");
      }
      setIsActionLoading(false);
    }
  };

  const handleSeedReviews = async () => {
    if (confirm("Would you like to seed default customer reviews? Existing reviews will be reset.")) {
      setIsActionLoading(true);
      const res = await seedDefaultReviewsAction();
      if (res.success) {
        alert("Default customer reviews seeded successfully!");
        fetchReviews();
      } else {
        alert(res.error || "Failed to seed reviews.");
      }
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight flex items-center gap-2">
            <Star className="h-8 w-8 text-green-700 fill-green-700" />
            Customer Reviews Manager
          </h2>
          <p className="text-gray-500 text-sm">Moderate client testimonials, approve new submissions, and manage ratings.</p>
        </div>

        <button
          onClick={handleSeedReviews}
          disabled={isLoading || isActionLoading}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-green-950 px-4 py-2.5 rounded-xl font-bold transition text-sm shrink-0 shadow-sm border border-amber-600 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span>Seed Default Reviews</span>
        </button>
      </div>

      {/* Main Reviews Container */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-3 text-gray-500 font-medium">
            <Loader2 className="h-8 w-8 text-green-700 animate-spin" />
            <span>Loading reviews database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Reviewer Details</th>
                  <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Comment</th>
                  <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-xs text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 align-middle">
                      <p className="font-bold text-gray-950 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{review.role || "Client"}</p>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="text-xs text-gray-600 line-clamp-3 max-w-xl font-normal leading-relaxed">
                        {review.comment}
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border bg-green-50 text-green-700 border-green-200">
                        Approved
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDelete(review.id)}
                          disabled={isActionLoading}
                          className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition border border-red-200"
                          title="Delete Review"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-gray-400 text-sm font-semibold">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="h-8 w-8 text-gray-300" />
                        <span>No customer reviews found. Seed defaults or submit a new review from the website.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
