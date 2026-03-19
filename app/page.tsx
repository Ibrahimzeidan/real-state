import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { ServiceCard } from "@/components/service-card"
import { Home, Key, TrendingUp, Users, Building2, FileText, ArrowRight, CheckCircle, Star } from "lucide-react"

const featuredProperties = [
  {
    id: "modern-villa",
    title: "Modern Villa with Pool",
    location: "Beverly Hills, CA",
    price: "$2,450,000",
    image: "/images/property-1.jpg",
    beds: 5,
    baths: 4,
    sqft: "4,200 sqft",
  },
  {
    id: "urban-townhouse",
    title: "Urban Townhouse",
    location: "Brooklyn, NY",
    price: "$1,850,000",
    image: "/images/property-2.jpg",
    beds: 4,
    baths: 3,
    sqft: "2,800 sqft",
  },
  {
    id: "luxury-penthouse",
    title: "Luxury Penthouse Suite",
    location: "Manhattan, NY",
    price: "$5,200,000",
    image: "/images/property-3.jpg",
    beds: 3,
    baths: 3,
    sqft: "3,500 sqft",
  },
  {
    id: "mediterranean-villa",
    title: "Mediterranean Villa",
    location: "Miami Beach, FL",
    price: "$3,750,000",
    image: "/images/property-4.jpg",
    beds: 6,
    baths: 5,
    sqft: "5,100 sqft",
  },
  {
    id: "contemporary-home",
    title: "Contemporary Family Home",
    location: "Austin, TX",
    price: "$890,000",
    image: "/images/property-5.jpg",
    beds: 4,
    baths: 3,
    sqft: "2,600 sqft",
  },
  {
    id: "suburban-retreat",
    title: "Suburban Retreat",
    location: "Denver, CO",
    price: "$720,000",
    image: "/images/property-6.jpg",
    beds: 4,
    baths: 2,
    sqft: "2,200 sqft",
  },
]

const services = [
  {
    title: "Property Sales",
    description: "Expert guidance through the entire selling process, from pricing strategy to closing.",
    icon: Home,
  },
  {
    title: "Property Purchase",
    description: "Find your perfect home with our comprehensive search and negotiation services.",
    icon: Key,
  },
  {
    title: "Investment Advisory",
    description: "Strategic advice for building and managing your real estate investment portfolio.",
    icon: TrendingUp,
  },
  {
    title: "Property Management",
    description: "Full-service management for your rental properties, maximizing your returns.",
    icon: Building2,
  },
  {
    title: "Consultation",
    description: "Professional consultation for all your real estate needs and questions.",
    icon: Users,
  },
  {
    title: "Legal Support",
    description: "Expert legal guidance for contracts, documentation, and property transactions.",
    icon: FileText,
  },
]

const stats = [
  { value: "500+", label: "Properties Sold" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "25+", label: "Years Experience" },
  { value: "50+", label: "Expert Agents" },
]

export default function HomePage() {
  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-home.jpg"
            alt="Luxury home exterior"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(80% 60% at 20% 20%, rgba(201,164,107,0.35), transparent 60%), linear-gradient(110deg, rgba(15,74,60,0.95), rgba(15,74,60,0.75), rgba(15,74,60,0.25))",
            }}
          />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-accent/30">
              <Star className="h-4 w-4 text-accent" />
              Trusted by 3,000+ Happy Clients
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Find Your Dream Home Today
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              Discover exceptional properties with PrimeNest Estates. We bring expertise, dedication, and personalized service to help you find the perfect place to call home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:scale-105 cursor-pointer shadow-xl shadow-accent/30"
              >
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 cursor-pointer"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Collection</span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Featured Properties
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Explore our handpicked selection of premium properties, each offering exceptional quality and location.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all duration-300 hover:text-accent hover:gap-3 cursor-pointer"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why Choose Us</span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
                Your Trusted Partner in Real Estate
              </h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                With over 25 years of experience, we have helped thousands of families find their perfect home. Our commitment to excellence sets us apart.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Expert market knowledge and analysis",
                  "Personalized service tailored to your needs",
                  "Transparent and honest communication",
                  "End-to-end support throughout your journey",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all duration-300 hover:gap-3 cursor-pointer"
              >
                Learn more about us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/about-team.jpg"
                alt="Our team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">What We Offer</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive real estate services tailored to your unique needs and goals.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 px-8 py-16 text-center sm:px-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/images/hero-home.jpg')] opacity-10 bg-cover bg-center" />
            <div className="relative">
              <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to Find Your Perfect Home?
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
                Let our experienced team guide you through every step of your real estate journey. Contact us today for a free consultation.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:scale-105 cursor-pointer shadow-xl shadow-black/20"
                >
                  Get in Touch
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/20 hover:border-primary-foreground/50 cursor-pointer"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
