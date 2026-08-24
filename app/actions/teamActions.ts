"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getTeamAction() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to get team members:", error);
    return { success: false, error: "Failed to load team members" };
  }
}

export async function createTeamMemberAction(data: {
  name: string;
  role: string;
  imageUrl: string | null;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const member = await prisma.teamMember.create({
      data,
    });

    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true, data: member };
  } catch (error) {
    console.error("Failed to create team member:", error);
    return { success: false, error: "Failed to add team member" };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    revalidatePath("/about");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return { success: false, error: "Failed to delete team member" };
  }
}
