import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";

// Ensure Next.js fetches fresh data from database on page visits
export const revalidate = 0;

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map values to plain objects to avoid serialization issues
  const plainProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description || "",
    images: p.images || [],
    category: p.category || "Phase 1",
    status: p.status || "Ongoing",
  }));

  return <HomeClient initialProjects={plainProjects} />;
}
