import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category?: string
  type?: "blog" | "news"
}

export function BlogCard({
  id,
  title,
  excerpt,
  image,
  date,
  category,
  type = "blog",
}: BlogCardProps) {
  const basePath = type === "news" ? "/news" : "/blog"
  
  return (
    <Link href={`${basePath}/${id}`} className="group block cursor-pointer">
      <article className="relative overflow-hidden rounded-2xl bg-card border border-border/70 shadow-[0_12px_35px_-28px_rgba(199,163,106,0.35)] transition-all duration-300 hover:shadow-[0_22px_55px_-30px_rgba(199,163,106,0.45)] hover:border-accent/60 hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {category && (
            <div className="absolute top-3 left-3">
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
                {category}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{date}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:text-accent transition-colors">
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  )
}
