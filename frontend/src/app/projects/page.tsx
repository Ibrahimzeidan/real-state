import { NavbarLight } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackImage = "/images/property-1.jpg";

type ProjectDetails = {
  location?: string;
  price?: string;
  beds?: number;
  baths?: number;
  sqft?: string | number;
};

function getDetails(details: unknown): ProjectDetails {
  if (!details || typeof details !== "object") return {};
  return details as ProjectDetails;
}

export default async function ProjectsPage() {
  await connectToDatabase();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  const items = projects.map((project: any) => {
    const details = getDetails(project.details);
    const sqftValue =
      typeof details.sqft === "number"
        ? `${details.sqft} sqft`
        : details.sqft;
    return {
      id: project._id.toString(),
      title: project.title,
      location: details.location || "Location available",
      price: details.price || "Contact for price",
      image: project.images?.[0] || fallbackImage,
      beds: typeof details.beds === "number" ? details.beds : undefined,
      baths: typeof details.baths === "number" ? details.baths : undefined,
      sqft: sqftValue,
    };
  });

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
          {items.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((project) => (
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
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No projects yet. Check back soon.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
