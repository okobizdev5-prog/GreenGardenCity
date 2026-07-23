import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectDetailsClient } from "@/components/ProjectDetailsClient";
import { parsePlotsFromProject } from "@/lib/projectUtils";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const id = (await params).id;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return {
      title: "Project Not Found - Green Garden City",
    };
  }

  return {
    title: `${project.title} - Green Garden City`,
    description: `Explore the master plan, amenities, and details of ${project.title} in Green Garden City.`,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const id = (await params).id;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const plainProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    images: project.images,
    category: project.category || "Phase 1",
    status: project.status || "Ongoing",
    availablePlots: parsePlotsFromProject(project),
  };

  return <ProjectDetailsClient project={plainProject} />;
}
