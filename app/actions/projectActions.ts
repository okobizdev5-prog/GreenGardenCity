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
        title: "Green Garden Premium Villas (Residential Plot)",
        description: `<h1>Green Garden Premium Villas</h1>
<p>Experience ultra-luxury living in our flagship residential plot masterplan. Nestled in a highly secure, natural green environment, these plots are perfect for building your dream family home with custom designs.</p>

<h3>Project Specifications</h3>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Project Category</td>
      <td style="padding: 8px; color: #475569;">Residential Plots</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Available Sizes</td>
      <td style="padding: 8px; color: #475569;">3 Katha, 5 Katha, 10 Katha</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Internal Roads</td>
      <td style="padding: 8px; color: #475569;">30 ft &amp; 40 ft Wide Paved Roads</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Utilities</td>
      <td style="padding: 8px; color: #475569;">Underground Electricity, Water &amp; Gas ready</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Security</td>
      <td style="padding: 8px; color: #475569;">24/7 Gated Entry, CCTV, Guard Patrols</td>
    </tr>
  </tbody>
</table>

<h3>Exclusive Amenities</h3>
<ul>
  <li>Central Playground &amp; Kids Play Zone</li>
  <li>Lakeside Walking Deck &amp; Eco Park Access</li>
  <li>Lush Green Buffer Zone for ultimate fresh air</li>
  <li>Immediate Plot Registration &amp; Mutation</li>
</ul>`,
        category: "Residential",
        status: "Ongoing",
        availablePlots: ["3 Katha", "5 Katha", "10 Katha", "Plot-101 (3 Katha)", "Plot-102 (5 Katha)"],
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200"
        ]
      },
      {
        title: "Lakeside Commercial Square (Commercial Plot)",
        description: `<h1>Lakeside Commercial Square</h1>
<p>A premium commercial land layout optimized for business centers, retail hubs, corporate offices, and banks. Positioned directly on the main 60ft entrance boulevard with unmatched brand visibility and lake-facing decks.</p>

<h3>Project Specifications</h3>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Project Category</td>
      <td style="padding: 8px; color: #475569;">Commercial Plots</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Available Sizes</td>
      <td style="padding: 8px; color: #475569;">5 Katha, 10 Katha, 15 Katha</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Road Access</td>
      <td style="padding: 8px; color: #475569;">Direct Access to 60 ft Main Boulevard</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Power Grid</td>
      <td style="padding: 8px; color: #475569;">High-Load Industrial Electricity Line Connections</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Drainage</td>
      <td style="padding: 8px; color: #475569;">High-Capacity Central Sewage Network</td>
    </tr>
  </tbody>
</table>

<h3>Business Facilities</h3>
<ul>
  <li>Dedicated Customer Parking Bays</li>
  <li>Broadband Fiber Optic Cable connectivity ready</li>
  <li>Stunning Lakefront views with boardwalk pathway</li>
  <li>Excellent long-term capital appreciation &amp; rental yields</li>
</ul>`,
        category: "Commercial",
        status: "Upcoming",
        availablePlots: ["3 Katha", "5 Katha", "Commercial Shop A1", "Commercial Office B2"],
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
        ]
      },
      {
        title: "Central Eco Park Estates (Garden House Plot)",
        description: `<h1>Central Eco Park Estates</h1>
<p>Luxurious nature-rich estate land plots reserved for private holiday villas, farmhouse gardens, and open-air lawns. Every plot enjoys panoramic views of the scenic central eco-park and lake decks.</p>

<h3>Project Specifications</h3>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Project Category</td>
      <td style="padding: 8px; color: #475569;">Garden House Plots</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Available Sizes</td>
      <td style="padding: 8px; color: #475569;">5 Katha, 10 Katha, 15 Katha</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Location Accent</td>
      <td style="padding: 8px; color: #475569;">Scenic Central Eco-Park &amp; Lake Frontage</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Green Architecture</td>
      <td style="padding: 8px; color: #475569;">Solar pathway light lines &amp; Rainwater harvesting ready</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
      <td style="padding: 8px; font-weight: bold; color: #0f172a;">Clubhouse Access</td>
      <td style="padding: 8px; color: #475569;">Includes lifetime premium membership card</td>
    </tr>
  </tbody>
</table>

<h3>Estate Highlights</h3>
<ul>
  <li>Private natural lake access with floating decks</li>
  <li>Premium Clubhouse featuring organic swimming pools &amp; cafe</li>
  <li>40% dedicated community green buffer landscape</li>
  <li>Eco-friendly community policy guidelines</li>
</ul>`,
        category: "Garden House",
        status: "Delivered",
        availablePlots: ["3 Katha", "5 Katha", "Plot G-101", "Plot G-102"],
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
