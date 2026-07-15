"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getBrochuresAction() {
  try {
    const brochures = await prisma.brochure.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: brochures };
  } catch (error) {
    console.error("Failed to get brochures:", error);
    return { success: false, error: "Failed to load brochures" };
  }
}

export async function createBrochureAction(data: {
  title: string;
  description: string;
  size: string;
  languages: string;
  imageUrl: string | null;
  pdfUrl: string | null;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const brochure = await prisma.brochure.create({
      data,
    });

    revalidatePath("/brochures");
    revalidatePath("/admin/brochures");
    return { success: true, data: brochure };
  } catch (error) {
    console.error("Failed to create brochure:", error);
    return { success: false, error: "Failed to create brochure" };
  }
}

export async function deleteBrochureAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.brochure.delete({
      where: { id },
    });

    revalidatePath("/brochures");
    revalidatePath("/admin/brochures");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete brochure:", error);
    return { success: false, error: "Failed to delete brochure" };
  }
}
