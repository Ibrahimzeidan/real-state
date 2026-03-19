import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { projects } from "@/lib/data"

export default function ProjectsPage() {
  return (
    <main>
      <NavbarLight />
      
      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 lux-hero border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl text-balance">
              Our Properties
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Explore our carefully curated selection of premium properties. From modern urban apartments to luxurious waterfront estates, find your perfect home.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-20 lg:pb-28 lux-section relative overflow-hidden border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <PropertyCard
                key={project.id}
                id={project.id}
                title={project.title}
                location={project.location}
                price={project.price}
                image={project.image}
                beds={project.beds}
                baths={project.baths}
                sqft={project.sqft}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
