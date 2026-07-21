import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "@/components/ProjectsClient";
import { parsePlotsFromProject } from "@/lib/projectUtils";

export const metadata = {
  title: "Development Projects - Greenleaf Holdings Ltd.",
  description: "Explore our premium residential communities, commercial hubs, and eco-friendly development projects in Greenleaf Holdings Ltd..",
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
    availablePlots: parsePlotsFromProject(p),
  }));

  return <ProjectsClient initialProjects={plainProjects} />;
}
