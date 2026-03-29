import { notFound } from "next/navigation";

import { BlogDetail } from "@/components/blog/blog-detail";
import { blogPosts } from "@/lib/data";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return notFound();
  return <BlogDetail post={post} />;
}
