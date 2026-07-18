import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "@/components/ProjectsClient";

export const metadata = {
  title: "Development Projects - Green Garden City",
  description: "Explore our premium residential communities, commercial hubs, and eco-friendly development projects in Green Garden City.",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const plainProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description || "",
    images: p.images || [],
    category: p.category || "Phase 1",
    status: p.status || "Ongoing",
  }));

  return <ProjectsClient initialProjects={plainProjects} />;
}
