"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type GalleryItemData = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
};

const getJsonFilePath = () => {
  return path.join(process.cwd(), "public", "uploads", "gallery.json");
};

export async function getGalleryItemsAction() {
  try {
    const filePath = getJsonFilePath();
    
    // Ensure file exists
    try {
      await fs.access(filePath);
    } catch {
      // Create directory and empty array if not exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify([]));
    }

    const fileData = await fs.readFile(filePath, "utf-8");
    const items: GalleryItemData[] = JSON.parse(fileData);
    
    // Sort by newest first
    const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { success: true, data: sorted };
  } catch (error) {
    console.error("Failed to get gallery items:", error);
    return { success: true, data: [] };
  }
}

export async function createGalleryItemAction(data: { title: string; imageUrl: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const filePath = getJsonFilePath();
    
    // Load current items
    let items: GalleryItemData[] = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      items = JSON.parse(fileData);
    } catch {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }

    const newItem: GalleryItemData = {
      id: Date.now().toString(),
      title: data.title || "Green Garden City",
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);

    await fs.writeFile(filePath, JSON.stringify(items, null, 2));

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true, data: newItem };
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return { success: false, error: "Failed to create gallery item" };
  }
}

export async function deleteGalleryItemAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const filePath = getJsonFilePath();
    
    let items: GalleryItemData[] = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      items = JSON.parse(fileData);
    } catch {
      return { success: true };
    }

    const filtered = items.filter(item => item.id !== id);

    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return { success: false, error: "Failed to delete gallery item" };
  }
}
