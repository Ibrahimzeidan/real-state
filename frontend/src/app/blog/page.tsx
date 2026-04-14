import { NavbarLight } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { connectToDatabase } from "@/lib/db";
import { Blog } from "@/models/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackImage = "/images/hero-home.jpg";

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function makeExcerpt(content: string, length = 140) {
  const cleaned = content.replace(/\s+/g, " ").trim();
  if (cleaned.length <= length) return cleaned;
  return `${cleaned.slice(0, length - 3)}...`;
}

export default async function BlogPage() {
  await connectToDatabase();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  const items = safeBlogs.map((post: any) => ({
    id: post._id.toString(),
    title: post.title,
    excerpt: makeExcerpt(post.content || ""),
    image: post.image || fallbackImage,
    date: formatDate(post.createdAt),
    category: "Blog",
  }));

  return (
    <main>
      <NavbarLight />

      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 lux-hero border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl text-balance">
              Blog
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Expert insights, tips, and guides to help you navigate the real estate market. Stay informed with our latest articles.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20 lg:pb-28 lux-section relative overflow-hidden border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {items.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  date={post.date}
                  category={post.category}
                  type="blog"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No blog posts yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
