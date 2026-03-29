import { BlogIndex } from "@/components/blog/blog-index";
import { blogPosts } from "@/lib/data";

export default function BlogPage() {
  return <BlogIndex posts={blogPosts} />;
}

