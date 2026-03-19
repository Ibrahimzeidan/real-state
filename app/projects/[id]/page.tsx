"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { projects } from "@/lib/data"
import { MapPin, Bed, Bath, Square, Calendar, Home, ArrowLeft, Check } from "lucide-react"

export default function ProjectDetailsPage() {
  const params = useParams()
  const project = projects.find((p) => p.id === params.id)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Interest form submitted:", formData)
    alert("Thank you for your interest! We will contact you shortly.")
    setFormData({ name: "", email: "", message: "" })
  }

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
    )
  }

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
              src={project.image}
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
                    <span>{project.location}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary">{project.price}</p>
              </div>

              {/* Property Stats */}
              <div className="mt-8 flex flex-wrap gap-6 rounded-lg bg-secondary p-6">
                <div className="flex items-center gap-3">
                  <Bed className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-semibold text-foreground">{project.beds}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-semibold text-foreground">{project.baths}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Square Feet</p>
                    <p className="font-semibold text-foreground">{project.sqft}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-semibold text-foreground">{project.yearBuilt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-semibold text-foreground">{project.propertyType}</p>
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
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar - Interest Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-xl bg-card p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground">Interested in this property?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and our team will get in touch with you.
                </p>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="I would like to schedule a viewing..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    I&apos;m Interested
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
