import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { blogPosts } from "@/lib/data"

export default function BlogPage() {
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
