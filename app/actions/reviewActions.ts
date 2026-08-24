"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getReviewsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Failed to get reviews:", error);
    return { success: false, error: "Failed to load reviews" };
  }
}

export async function getApprovedReviewsAction() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reviews };
  } catch (error) {
    console.error("Failed to get approved reviews:", error);
    return { success: false, error: "Failed to load approved reviews" };
  }
}

export async function createReviewAction(data: {
  name: string;
  role?: string;
  rating: number;
  comment: string;
}) {
  try {
    const review = await prisma.review.create({
      data: {
        name: data.name,
        role: data.role || "Client",
        rating: data.rating,
        comment: data.comment,
        approved: true, // Auto-approved; admin can delete if needed
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, data: review };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}

export async function approveReviewAction(id: string, approved: boolean) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const review = await prisma.review.update({
      where: { id },
      data: { approved },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true, data: review };
  } catch (error) {
    console.error("Failed to approve review:", error);
    return { success: false, error: "Failed to update review status" };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.review.delete({
      where: { id },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "Failed to delete review" };
  }
}

export async function seedDefaultReviewsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Clean existing
    await prisma.review.deleteMany({});

    const defaultReviews = [
      {
        name: "ড. মো: আনিসুর রহমান",
        role: "সরকারি কর্মকর্তা ও প্লট ক্রেতা",
        rating: 5,
        comment: "গ্রীন গার্ডেন সিটি ঢাকার এত কাছে এবং সম্পূর্ণ পরিকল্পিত উপায়ে তৈরি করা হচ্ছে দেখে আমি খুবই মুগ্ধ। বিশেষ করে তাদের চওড়া রাস্তা এবং লেকের প্রাকৃতিক পরিবেশ আমাদের মতো অবসরপ্রাপ্ত মানুষের বসবাসের জন্য আদর্শ।",
        approved: true,
      },
      {
        name: "সায়েম চৌধুরী",
        role: "ব্যবসায়ী ও বিনিয়োগকারী",
        rating: 5,
        comment: "আমি ৩টি প্লট নিয়েছি ভবিষ্যৎ বিনিয়োগের জন্য। রেজিস্ট্রি ও কাগজপত্র বুঝে পাওয়ার প্রক্রিয়াটি খুবই স্বচ্ছ এবং ঝামেলামুক্ত ছিল। ঢাকার জ্যাম ও কোলাহল থেকে দূরে সুন্দর একটি পরিকল্পিত আবাসন।",
        approved: true,
      },
      {
        name: "নুসরাত জাহান লিয়া",
        role: "আইটি প্রফেশনাল ও গৃহিণী",
        rating: 5,
        comment: "বাচ্চাদের খেলার মাঠ, পার্ক এবং বিশাল মসজিদের ডিজাইন আমাকে সবচেয়ে বেশি আকৃষ্ট করেছে। নাগরিক জীবনের সব সুবিধা এখানে বজায় রেখে প্রাকৃতিক পরিবেশ রক্ষা করা হয়েছে। বুকিং করার পর থেকেই তাদের সেবা চমৎকার।",
        approved: true,
      }
    ];

    await prisma.review.createMany({
      data: defaultReviews,
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to seed reviews:", error);
    return { success: false, error: "Failed to seed default reviews" };
  }
}
