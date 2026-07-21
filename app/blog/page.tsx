import { prisma } from "@/lib/prisma";
import { BlogClient } from "@/components/BlogClient";

export const metadata = {
  title: "Insights & Life - Greenleaf Holdings Ltd.",
  description: "Read updates, design details, and community stories from Greenleaf Holdings Ltd..",
};

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  const plainPosts = posts.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    date: p.date,
    summary: p.summary,
    imageUrl: p.imageUrl,
    featured: p.featured,
    specialCard: p.specialCard,
  }));

  return <BlogClient initialPosts={plainPosts} />;
}
