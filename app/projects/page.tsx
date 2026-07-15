import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "@/components/ProjectsClient";

export const metadata = {
  title: "Available Plots - Green Garden City",
  description: "Browse premium residential plots, select from 3, 5, or 10 Katha configurations and book site visits directly.",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const plainProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    size: p.size,
    imageUrl: p.imageUrl,
    features: p.features,
    price: p.price,
    zone: p.zone,
    status: p.status,
  }));

  return <ProjectsClient initialProjects={plainProjects} />;
}
