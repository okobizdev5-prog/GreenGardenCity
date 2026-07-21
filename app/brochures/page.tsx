import { prisma } from "@/lib/prisma";
import { BrochuresClient } from "@/components/BrochuresClient";

export const metadata = {
  title: "Project Brochures - Greenleaf Holdings Ltd.",
  description: "Download detailed layouts, amenity guides, and plot zoning blueprints for Greenleaf Holdings Ltd..",
};

export const revalidate = 0;

export default async function BrochuresPage() {
  const brochures = await prisma.brochure.findMany({
    orderBy: { createdAt: "desc" },
  });

  const plainBrochures = brochures.map(b => ({
    id: b.id,
    title: b.title,
    description: b.description,
    size: b.size,
    languages: b.languages,
    imageUrl: b.imageUrl,
    pdfUrl: b.pdfUrl,
  }));

  return <BrochuresClient initialBrochures={plainBrochures} />;
}
