import { NavbarLight } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogCard } from "@/components/blog-card";
import { connectToDatabase } from "@/lib/db";
import { News } from "@/models/news";

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

export default async function NewsPage() {
  await connectToDatabase();
  const newsItems = await News.find().sort({ createdAt: -1 }).lean();

  const items = newsItems.map((item: any) => ({
    id: item._id.toString(),
    title: item.title,
    excerpt: makeExcerpt(item.content || ""),
    image: item.image || fallbackImage,
    date: formatDate(item.createdAt),
    category: item.category || "News",
  }));

  return (
    <main>
      <NavbarLight />

      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 lux-hero border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl text-balance">
              News
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Stay up to date with the latest real estate market trends, company announcements, and industry news.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="pb-20 lg:pb-28 lux-section relative overflow-hidden border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {items.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <BlogCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  image={item.image}
                  date={item.date}
                  category={item.category}
                  type="news"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No news yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
