import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <div className="group relative rounded-2xl bg-card p-6 border border-border/70 shadow-[0_12px_35px_-28px_rgba(199,163,106,0.35)] transition-all duration-300 hover:shadow-[0_22px_55px_-30px_rgba(199,163,106,0.45)] hover:border-accent/60 hover:-translate-y-1 cursor-pointer">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
        <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
