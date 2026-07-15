"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getBlogPostsAction() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Failed to get blog posts:", error);
    return { success: false, error: "Failed to load blog posts" };
  }
}

export async function createBlogPostAction(data: {
  title: string;
  category: string;
  date: string;
  summary: string;
  imageUrl: string | null;
  featured: boolean;
  specialCard: boolean;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.blogPost.create({
      data,
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, data: post };
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}
