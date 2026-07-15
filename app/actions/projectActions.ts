"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getProjectsAction() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to get projects:", error);
    return { success: false, error: "Failed to load projects" };
  }
}

export async function createProjectAction(data: {
  title: string;
  size: string;
  imageUrl: string | null;
  features: string;
  price: string | null;
  zone?: string;
  status?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await prisma.project.create({
      data,
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
