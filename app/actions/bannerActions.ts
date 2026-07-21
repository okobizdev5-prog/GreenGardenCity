"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type BannerData = {
  id?: string;
  badgeText: string;
  title: string;
  highlightTitle: string;
  subtitle: string;
  bgImage: string;
  highlights: string[];
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  isActive?: boolean;
};

const defaultBanners: BannerData[] = [
  {
    badgeText: "100% GATED & SECURE ECO-CITY",
    title: "Discover the Future of",
    highlightTitle: "Urban Living",
    subtitle: "Experience the perfect harmony of modern architecture, advanced smart facilities, and pristine natural serenity. Your dream plot awaits at Greenleaf Holdings Ltd..",
    bgImage: "/hero_background.png",
    highlights: [
      "Immediate Plot Registration",
      "Electricity & Gas Connections Ready",
      "15 Mins Drive from Hazrat Shahjalal Airport",
      "Flexible Installment Plans Available"
    ],
    primaryBtnText: "Book a Site Visit",
    primaryBtnLink: "#booking",
    secondaryBtnText: "Explore Plots",
    secondaryBtnLink: "#plots",
    isActive: true,
  },
  {
    badgeText: "PREMIUM WATERFRONT VILLAS",
    title: "Exclusive Lakeside",
    highlightTitle: "Private Residences",
    subtitle: "Architectural perfection blended with private infinity pools, panoramic lake views, and lush tropical gardens in Greenleaf Holdings Ltd..",
    bgImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600",
    highlights: [
      "Private Lake Access & Deck",
      "Smart Villa Home Automation",
      "Dedicated Solar Energy Grid",
      "24/7 Concierge & Perimeter Security"
    ],
    primaryBtnText: "Schedule Private Tour",
    primaryBtnLink: "#booking",
    secondaryBtnText: "View Master Plan",
    secondaryBtnLink: "#projects",
    isActive: true,
  },
  {
    badgeText: "COMMERCIAL & RETAIL HUB",
    title: "Invest in Prime",
    highlightTitle: "Business Growth",
    subtitle: "State-of-the-art commercial towers and retail boulevards situated right on the 60ft main boulevard for maximum footfall and rental yield.",
    bgImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600",
    highlights: [
      "60ft Boulevard Frontage",
      "High-Speed Panoramic Elevators",
      "Rooftop Business Lounge",
      "Flexible Commercial Lease Terms"
    ],
    primaryBtnText: "Inquire Commercial Space",
    primaryBtnLink: "#booking",
    secondaryBtnText: "Download Brochure",
    secondaryBtnLink: "/brochures",
    isActive: true,
  }
];

export async function getBannersAction() {
  try {
    const bannerModel = (prisma as any).banner;
    if (!bannerModel) {
      return { success: true, data: [defaultBanners[0]] };
    }

    const banners = await bannerModel.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!banners || banners.length === 0) {
      return { success: true, data: [defaultBanners[0]] };
    }

    const mappedBanners: BannerData[] = banners.map((b: any) => ({
      id: b.id,
      badgeText: b.badgeText || defaultBanners[0].badgeText,
      title: b.title || defaultBanners[0].title,
      highlightTitle: b.highlightTitle || defaultBanners[0].highlightTitle,
      subtitle: b.subtitle || defaultBanners[0].subtitle,
      bgImage: b.bgImage || defaultBanners[0].bgImage,
      highlights: Array.isArray(b.highlights) && b.highlights.length > 0
        ? b.highlights
        : defaultBanners[0].highlights,
      primaryBtnText: b.primaryBtnText || defaultBanners[0].primaryBtnText,
      primaryBtnLink: b.primaryBtnLink || defaultBanners[0].primaryBtnLink,
      secondaryBtnText: b.secondaryBtnText || defaultBanners[0].secondaryBtnText,
      secondaryBtnLink: b.secondaryBtnLink || defaultBanners[0].secondaryBtnLink,
      isActive: b.isActive ?? true,
    }));

    return { success: true, data: mappedBanners };
  } catch (error) {
    console.error("Failed to get banners:", error);
    return { success: true, data: [defaultBanners[0]] };
  }
}

export async function createBannerAction(data: BannerData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bannerModel = (prisma as any).banner;
    const newBanner = await bannerModel.create({
      data: {
        badgeText: data.badgeText,
        title: data.title,
        highlightTitle: data.highlightTitle,
        subtitle: data.subtitle,
        bgImage: data.bgImage,
        highlights: data.highlights,
        primaryBtnText: data.primaryBtnText,
        primaryBtnLink: data.primaryBtnLink,
        secondaryBtnText: data.secondaryBtnText,
        secondaryBtnLink: data.secondaryBtnLink,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true, data: newBanner };
  } catch (error) {
    console.error("Failed to create banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

export async function updateBannerAction(id: string, data: BannerData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bannerModel = (prisma as any).banner;
    const updated = await bannerModel.update({
      where: { id },
      data: {
        badgeText: data.badgeText,
        title: data.title,
        highlightTitle: data.highlightTitle,
        subtitle: data.subtitle,
        bgImage: data.bgImage,
        highlights: data.highlights,
        primaryBtnText: data.primaryBtnText,
        primaryBtnLink: data.primaryBtnLink,
        secondaryBtnText: data.secondaryBtnText,
        secondaryBtnLink: data.secondaryBtnLink,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

export async function deleteBannerAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bannerModel = (prisma as any).banner;
    await bannerModel.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}

export async function seedDefaultBannersAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const bannerModel = (prisma as any).banner;
    await bannerModel.deleteMany({});

    for (const b of defaultBanners) {
      await bannerModel.create({ data: b });
    }

    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true };
  } catch (error) {
    console.error("Failed to seed default banners:", error);
    return { success: false, error: "Failed to seed default banners" };
  }
}
