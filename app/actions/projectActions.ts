"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PlotObject, formatDescriptionWithPlots, parsePlotsFromProject } from "@/lib/projectUtils";

export async function getProjectsAction() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    const parsedProjects = projects.map((p) => ({
      ...p,
      availablePlots: parsePlotsFromProject(p),
    }));
    return { success: true, data: parsedProjects };
  } catch (error) {
    console.error("Failed to get projects:", error);
    return { success: false, error: "Failed to load projects" };
  }
}

export async function createProjectAction(data: {
  title: string;
  description: string;
  images: string[];
  category?: string;
  status?: string;
  availablePlots?: (string | PlotObject)[];
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const plotsToSave = data.availablePlots || [
      { name: "3 Katha", isSoldOut: false },
      { name: "5 Katha", isSoldOut: false },
      { name: "10 Katha", isSoldOut: false },
    ];
    const formattedDescription = formatDescriptionWithPlots(data.description, plotsToSave);

    let project: any;
    try {
      project = await (prisma as any).project.create({
        data: {
          title: data.title,
          description: formattedDescription,
          images: data.images,
          category: data.category || "Land - Phase 1",
          status: data.status || "Ongoing",
          availablePlots: plotsToSave,
        },
      });
    } catch (createErr) {
      // Fallback if Prisma client validation fails due to ungenerated engine types
      project = await (prisma as any).project.create({
        data: {
          title: data.title,
          description: formattedDescription,
          images: data.images,
          category: data.category || "Land - Phase 1",
          status: data.status || "Ongoing",
        },
      });
    }

    const plainProject = {
      ...project,
      availablePlots: parsePlotsFromProject(project),
    };

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, data: plainProject };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProjectAction(
  id: string,
  data: {
    title?: string;
    description?: string;
    images?: string[];
    category?: string;
    status?: string;
    availablePlots?: (string | PlotObject)[];
  }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const plotsToSave = data.availablePlots;
    const formattedDescription = data.description !== undefined
      ? formatDescriptionWithPlots(data.description, plotsToSave)
      : undefined;

    let project: any;
    try {
      project = await (prisma as any).project.update({
        where: { id },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(formattedDescription !== undefined ? { description: formattedDescription } : {}),
          ...(data.images ? { images: data.images } : {}),
          ...(data.category ? { category: data.category } : {}),
          ...(data.status ? { status: data.status } : {}),
          ...(plotsToSave ? { availablePlots: plotsToSave } : {}),
        },
      });
    } catch (updateErr) {
      project = await (prisma as any).project.update({
        where: { id },
        data: {
          ...(data.title ? { title: data.title } : {}),
          ...(formattedDescription !== undefined ? { description: formattedDescription } : {}),
          ...(data.images ? { images: data.images } : {}),
          ...(data.category ? { category: data.category } : {}),
          ...(data.status ? { status: data.status } : {}),
        },
      });
    }

    const plainProject = {
      ...project,
      availablePlots: parsePlotsFromProject(project),
    };

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/admin/projects");
    return { success: true, data: plainProject };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function seedDefaultProjectsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete existing projects
    await prisma.project.deleteMany({});

    // Seed premium projects
    const premiumProjects = [
      {
        title: "Green Garden Premium Villas",
        description: `<h1>Green Garden Premium Villas</h1><p>Experience ultra-luxury living in our flagship villa project. Surrounded by natural lakes and private gardens, these villas offer the perfect sanctuary for your family.</p><h3>Key Features</h3><ul><li>Private Infinity Pools &amp; Sun Decks</li><li>Smart Home Automation &amp; Centralized AC</li><li>Renewable Solar Power Grid Connection</li><li>24/7 Gated Security &amp; CCTV Surveillance</li></ul><p>Located in the heart of Green Garden City, each villa layout is customizable to fit your architectural preferences.</p>`,
        category: "Land - Phase 1",
        status: "Ongoing",
        availablePlots: ["3 Katha", "5 Katha", "10 Katha", "Plot-101 (3 Katha)", "Plot-102 (5 Katha)"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200"
        ]
      },
      {
        title: "Lakeside Commercial Square",
        description: `<h1>Lakeside Commercial Square</h1><p>A state-of-the-art business center designed for modern enterprises, corporate offices, and premium retail outlets. Located on the main 60ft boulevard with direct lake access and ample visitor parking.</p><h3>Key Features</h3><ul><li>Central Air Conditioning &amp; HVAC Systems</li><li>High-Speed Panoramic Elevators</li><li>Rooftop Restaurant &amp; Business Lounge</li><li>Fibre-Optic Internet &amp; 100% Power Backup</li></ul><p>Invest in retail spaces or full office floors with highly attractive rental yield projections.</p>`,
        category: "Land - Phase 2",
        status: "Upcoming",
        availablePlots: ["3 Katha", "5 Katha", "Commercial Shop A1", "Commercial Office B2"],
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
        ]
      },
      {
        title: "Central Eco Park Residences",
        description: `<h1>Central Eco Park Residences</h1><p>High-rise residential apartments with 360-degree views of our central park. Integrated with sustainable design principles to maximize natural light, cross-ventilation, and eco-friendly waste management.</p><h3>Key Features</h3><ul><li>Rooftop Jogging Track &amp; Sky Garden</li><li>Rainwater Harvesting &amp; Greywater Recycling</li><li>Fully Equipped Gymnasium &amp; Swimming Pool</li><li>Children's Safe Play Zone &amp; Daycare Center</li></ul><p>Perfect for modern urban families seeking convenience, community, and clean fresh air.</p>`,
        category: "Apartment",
        status: "Delivered",
        availablePlots: ["3 Katha", "5 Katha", "Flat A-301 (1500 sqft)", "Flat B-502 (1800 sqft)"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200"
        ]
      }
    ];

    for (const proj of premiumProjects) {
      const formattedDescription = formatDescriptionWithPlots(proj.description, proj.availablePlots);
      try {
        await (prisma as any).project.create({
          data: {
            title: proj.title,
            description: formattedDescription,
            category: proj.category,
            status: proj.status,
            images: proj.images,
            availablePlots: proj.availablePlots,
          },
        });
      } catch (err) {
        await (prisma as any).project.create({
          data: {
            title: proj.title,
            description: formattedDescription,
            category: proj.category,
            status: proj.status,
            images: proj.images,
          },
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to seed projects:", error);
    return { success: false, error: "Failed to seed default projects" };
  }
}
