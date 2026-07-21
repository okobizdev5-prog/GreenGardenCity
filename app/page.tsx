import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";
import { getBannersAction } from "@/app/actions/bannerActions";
import { parsePlotsFromProject } from "@/lib/projectUtils";

// Ensure Next.js fetches fresh data from database on page visits
export const revalidate = 0;

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const bannerRes = await getBannersAction();
  const banners = bannerRes.data || [];

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

  return <HomeClient initialProjects={plainProjects} banners={banners} />;
}
