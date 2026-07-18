"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getProjectsAction() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: projects };
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
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        images: data.images,
        category: data.category || "Land - Phase 1",
        status: data.status || "Ongoing",
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
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
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200",
          "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=1200",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200"
        ]
      }
    ];

    for (const proj of premiumProjects) {
      await prisma.project.create({
        data: proj,
      });
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
