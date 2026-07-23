import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { getBannersAction } from "@/app/actions/bannerActions";
import { getActiveAboutAction } from "@/app/actions/aboutActions";
import { getGalleryItemsAction } from "@/app/actions/galleryActions";
import { getApprovedReviewsAction } from "@/app/actions/reviewActions";
import { parsePlotsFromProject } from "@/lib/projectUtils";

// Ensure Next.js fetches fresh data from database on page visits
export const revalidate = 0;

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const bannerRes = await getBannersAction();
  const banners = bannerRes.data || [];

  const aboutRes = await getActiveAboutAction();
  const about = aboutRes.data;

  const galleryRes = await getGalleryItemsAction();
  const galleryItems = galleryRes.success && galleryRes.data ? galleryRes.data : [];

  const reviewsRes = await getApprovedReviewsAction();
  const reviews = reviewsRes.success && reviewsRes.data ? reviewsRes.data.map(r => ({
    id: r.id,
    name: r.name,
    role: r.role,
    rating: r.rating,
    comment: r.comment,
  })) : [];

  // Map values to plain objects to avoid serialization issues
  const plainProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description || "",
    images: p.images || [],
    category: p.category || "Phase 1",
    status: p.status || "Ongoing",
    availablePlots: parsePlotsFromProject(p),
  }));

  return (
    <HomeClient
      initialProjects={plainProjects}
      banners={banners}
      about={about}
      galleryItems={galleryItems}
      reviews={reviews}
    />
  );
}

