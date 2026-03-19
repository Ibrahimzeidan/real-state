import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { newsItems } from "@/lib/data"

export default function NewsPage() {
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
