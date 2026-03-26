import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bath, Bed, Calendar, Check, Home, MapPin, Square } from "lucide-react";

import { NavbarLight } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectInterestForm } from "@/components/projects/interest-form";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/project";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackImage = "/images/property-1.jpg";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

type ProjectDetails = {
  location?: string;
  price?: string;
  beds?: number;
  baths?: number;
  sqft?: string | number;
  yearBuilt?: string | number;
  propertyType?: string;
  features?: string[];
};

function getDetails(details: unknown): ProjectDetails {
  if (!details || typeof details !== "object") return {};
  return details as ProjectDetails;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  await connectToDatabase();
  const project = await Project.findById(id).lean();

  if (!project) {
    return (
      <main>
        <NavbarLight />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">Property Not Found</h1>
            <p className="mt-2 text-muted-foreground">The property you are looking for does not exist.</p>
            <Link
              href="/projects"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const details = getDetails(project.details);
  const location = details.location || "Location available";
  const price = details.price || "Contact for price";
  const beds = typeof details.beds === "number" ? details.beds : undefined;
  const baths = typeof details.baths === "number" ? details.baths : undefined;
  const sqft =
    typeof details.sqft === "number" ? `${details.sqft} sqft` : details.sqft;
  const yearBuilt = details.yearBuilt ?? "N/A";
  const propertyType = details.propertyType ?? "Residential";
  const features = Array.isArray(details.features) ? details.features : [];
  const heroImage = project.images?.[0] || fallbackImage;

  return (
    <main>
      <NavbarLight />

      {/* Back Link */}
      <section className="pt-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>
        </div>
      </section>

      {/* Hero Image */}
      <section className="pt-6 pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-xl">
            <Image
              src={heroImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                    {project.title}
                  </h1>
                  <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary">{price}</p>
              </div>

              {/* Property Stats */}
              <div className="mt-8 flex flex-wrap gap-6 rounded-lg bg-secondary p-6">
                {beds !== undefined ? (
                  <div className="flex items-center gap-3">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-semibold text-foreground">{beds}</p>
                    </div>
                  </div>
                ) : null}
                {baths !== undefined ? (
                  <div className="flex items-center gap-3">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-semibold text-foreground">{baths}</p>
                    </div>
                  </div>
                ) : null}
                {sqft ? (
                  <div className="flex items-center gap-3">
                    <Square className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Square Feet</p>
                      <p className="font-semibold text-foreground">{sqft}</p>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-semibold text-foreground">{String(yearBuilt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-semibold text-foreground">{propertyType}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-foreground">Description</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Features */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-foreground">Features & Amenities</h2>
                {features.length ? (
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No additional features listed.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar - Interest Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-xl bg-card p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground">Interested in this property?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and our team will get in touch with you.
                </p>
                <ProjectInterestForm projectId={project._id.toString()} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
