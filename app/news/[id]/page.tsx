import Image from "next/image"
import Link from "next/link"
import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { newsItems } from "@/lib/data"
import { ArrowLeft, Calendar, Tag } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NewsDetailsPage({ params }: Props) {
  const { id } = await params
  const news = newsItems.find((n) => n.id === id)

  if (!news) {
    return (
      <main>
        <NavbarLight />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">News Article Not Found</h1>
            <p className="mt-2 text-muted-foreground">The news article you are looking for does not exist.</p>
            <Link
              href="/news"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <NavbarLight />
      
      {/* Back Link */}
      <section className="pt-8">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="pt-8 pb-20 lg:pb-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Header */}
          <header>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {news.date}
              </span>
              {news.category && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  {news.category}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance leading-tight">
              {news.title}
            </h1>
          </header>

          {/* Featured Image */}
          <div className="mt-8 relative aspect-[2/1] overflow-hidden rounded-xl">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="mt-10 prose prose-lg max-w-none">
            {news.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h2 key={index} className="text-xl font-semibold text-foreground mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('*') && paragraph.endsWith('*') && !paragraph.startsWith('**')) {
                return (
                  <p key={index} className="text-muted-foreground italic">
                    {paragraph.replace(/\*/g, '')}
                  </p>
                )
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(line => line.startsWith('- '))
                return (
                  <ul key={index} className="list-disc list-inside text-muted-foreground space-y-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
