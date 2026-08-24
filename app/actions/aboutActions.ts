"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type AboutData = {
  id?: string;
  badge: string;
  title: string;
  desc1: string;
  desc2?: string;
  stat1Num: string;
  stat1Label: string;
  stat2Num: string;
  stat2Label: string;
  mediaUrl: string;
  isActive?: boolean;
};

// Initial default settings
const defaultAbout: AboutData = {
  badge: "About Our Vision",
  title: "A Glimpse into Sustainable Luxury",
  desc1: "Green Garden City is carefully crafted to offer a highly secure, pollution-free, and natural living environment. Our community is designed with premium infrastructure and modern layouts, catering to families seeking luxury coupled with green surroundings.",
  desc2: "",
  stat1Num: "100+",
  stat1Label: "Happy Plot Buyers",
  stat2Num: "40%",
  stat2Label: "Dedicated Greenery & Lakes",
  mediaUrl: "/vision_image.png",
  isActive: true,
};

export async function getAboutEntriesAction() {
  try {
    const aboutModel = (prisma as any).about;
    if (!aboutModel) {
      return { success: true, data: [defaultAbout] };
    }

    const entries = await aboutModel.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!entries || entries.length === 0) {
      return { success: true, data: [defaultAbout] };
    }

    const mapped: AboutData[] = entries.map((a: any) => ({
      id: a.id,
      badge: a.badge ?? defaultAbout.badge,
      title: a.title ?? defaultAbout.title,
      desc1: a.desc1 ?? defaultAbout.desc1,
      desc2: a.desc2 ?? defaultAbout.desc2,
      stat1Num: a.stat1Num ?? defaultAbout.stat1Num,
      stat1Label: a.stat1Label ?? defaultAbout.stat1Label,
      stat2Num: a.stat2Num ?? defaultAbout.stat2Num,
      stat2Label: a.stat2Label ?? defaultAbout.stat2Label,
      mediaUrl: a.mediaUrl ?? defaultAbout.mediaUrl,
      isActive: a.isActive ?? true,
    }));

    return { success: true, data: mapped };
  } catch (error) {
    console.error("Failed to get about entries:", error);
    return { success: true, data: [defaultAbout] };
  }
}

export async function getActiveAboutAction() {
  try {
    const aboutModel = (prisma as any).about;
    if (!aboutModel) {
      return { success: true, data: defaultAbout };
    }

    const activeEntry = await aboutModel.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!activeEntry) {
      // Fallback to the latest created if none is explicitly marked active
      const latest = await aboutModel.findFirst({
        orderBy: { createdAt: "desc" },
      });
      return { success: true, data: latest ? {
        id: latest.id,
        badge: latest.badge,
        title: latest.title,
        desc1: latest.desc1,
        desc2: latest.desc2,
        stat1Num: latest.stat1Num,
        stat1Label: latest.stat1Label,
        stat2Num: latest.stat2Num,
        stat2Label: latest.stat2Label,
        mediaUrl: latest.mediaUrl,
        isActive: latest.isActive,
      } : defaultAbout };
    }

    return {
      success: true,
      data: {
        id: activeEntry.id,
        badge: activeEntry.badge,
        title: activeEntry.title,
        desc1: activeEntry.desc1,
        desc2: activeEntry.desc2,
        stat1Num: activeEntry.stat1Num,
        stat1Label: activeEntry.stat1Label,
        stat2Num: activeEntry.stat2Num,
        stat2Label: activeEntry.stat2Label,
        mediaUrl: activeEntry.mediaUrl,
        isActive: activeEntry.isActive,
      }
    };
  } catch (error) {
    console.error("Failed to get active about:", error);
    return { success: true, data: defaultAbout };
  }
}

export async function createAboutAction(data: AboutData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const aboutModel = (prisma as any).about;
    
    // If the new entry is active, deactivate all other entries first
    if (data.isActive) {
      await aboutModel.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newEntry = await aboutModel.create({
      data: {
        badge: data.badge,
        title: data.title,
        desc1: data.desc1,
        desc2: data.desc2 ?? "",
        stat1Num: data.stat1Num,
        stat1Label: data.stat1Label,
        stat2Num: data.stat2Num,
        stat2Label: data.stat2Label,
        mediaUrl: data.mediaUrl,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true, data: newEntry };
  } catch (error) {
    console.error("Failed to create about entry:", error);
    return { success: false, error: "Failed to create about entry" };
  }
}

export async function updateAboutAction(id: string, data: AboutData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const aboutModel = (prisma as any).about;

    // If setting active, deactivate other entries first
    if (data.isActive) {
      await aboutModel.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    const updated = await aboutModel.update({
      where: { id },
      data: {
        badge: data.badge,
        title: data.title,
        desc1: data.desc1,
        desc2: data.desc2 ?? "",
        stat1Num: data.stat1Num,
        stat1Label: data.stat1Label,
        stat2Num: data.stat2Num,
        stat2Label: data.stat2Label,
        mediaUrl: data.mediaUrl,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update about entry:", error);
    return { success: false, error: "Failed to update about entry" };
  }
}

export async function deleteAboutAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const aboutModel = (prisma as any).about;
    await aboutModel.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete about entry:", error);
    return { success: false, error: "Failed to delete about entry" };
  }
}

export async function setActiveAboutAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const aboutModel = (prisma as any).about;

    // Deactivate all
    await aboutModel.updateMany({
      data: { isActive: false },
    });

    // Activate selected
    await aboutModel.update({
      where: { id },
      data: { isActive: true },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("Failed to set active about entry:", error);
    return { success: false, error: "Failed to set active about entry" };
  }
}
