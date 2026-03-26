import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: string
  image: string
  beds?: number
  baths?: number
  sqft?: string
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  image,
  beds,
  baths,
  sqft,
}: PropertyCardProps) {
  return (
    <Link href={`/projects/${id}`} className="group block cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border/70 shadow-[0_12px_35px_-28px_rgba(199,163,106,0.35)] transition-all duration-300 hover:shadow-[0_22px_55px_-30px_rgba(199,163,106,0.45)] hover:border-accent/60 hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Featured
            </span>
          </div>
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
              View Details
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xl font-bold text-accent">{price}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
          {(beds || baths || sqft) && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
              {beds && (
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-primary/70" />
                  {beds} Beds
                </span>
              )}
              {baths && (
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-primary/70" />
                  {baths} Baths
                </span>
              )}
              {sqft && (
                <span className="flex items-center gap-1.5">
                  <Square className="h-4 w-4 text-primary/70" />
                  {sqft}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
