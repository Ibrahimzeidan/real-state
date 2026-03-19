import Link from "next/link"
import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Home, Key, TrendingUp, Building2, Users, FileText, Search, Camera, ArrowRight, CheckCircle } from "lucide-react"

const services = [
  {
    title: "Property Sales",
    description: "Our expert team provides comprehensive support throughout the entire selling process. From accurate market valuations to strategic marketing and skilled negotiations, we ensure you achieve the best possible outcome for your property sale.",
    icon: Home,
    features: ["Market Analysis", "Professional Photography", "Strategic Marketing", "Negotiation Support"],
  },
  {
    title: "Property Purchase",
    description: "Finding your dream home has never been easier. We offer personalized property search services, thorough market research, and expert guidance to help you make informed decisions and secure the perfect property.",
    icon: Key,
    features: ["Personalized Search", "Market Research", "Property Inspections", "Price Negotiation"],
  },
  {
    title: "Investment Advisory",
    description: "Build and grow your real estate portfolio with our strategic investment advisory services. We analyze market trends, identify opportunities, and provide data-driven recommendations to maximize your returns.",
    icon: TrendingUp,
    features: ["Portfolio Analysis", "Market Forecasting", "ROI Optimization", "Risk Assessment"],
  },
  {
    title: "Property Management",
    description: "Let us handle the day-to-day management of your rental properties. Our comprehensive services include tenant screening, maintenance coordination, rent collection, and financial reporting.",
    icon: Building2,
    features: ["Tenant Screening", "Maintenance", "Rent Collection", "Financial Reports"],
  },
  {
    title: "Consultation Services",
    description: "Get expert advice on any real estate matter. Whether you are a first-time buyer, seasoned investor, or property owner, our consultants provide personalized guidance tailored to your specific needs.",
    icon: Users,
    features: ["Expert Advice", "Market Insights", "Strategic Planning", "Personal Guidance"],
  },
  {
    title: "Legal Support",
    description: "Navigate the legal complexities of real estate transactions with confidence. Our legal team assists with contracts, documentation, title searches, and ensures compliance with all regulations.",
    icon: FileText,
    features: ["Contract Review", "Documentation", "Title Search", "Compliance"],
  },
  {
    title: "Property Valuation",
    description: "Get accurate, detailed property valuations based on comprehensive market analysis. Our valuations are trusted by banks, investors, and homeowners for making informed decisions.",
    icon: Search,
    features: ["Market Analysis", "Comparative Studies", "Detailed Reports", "Expert Assessment"],
  },
  {
    title: "Virtual Tours",
    description: "Experience properties from anywhere with our immersive virtual tour services. High-quality 3D tours and professional photography bring properties to life for remote buyers.",
    icon: Camera,
    features: ["3D Virtual Tours", "HD Photography", "Drone Footage", "Interactive Maps"],
  },
]

export default function ServicesPage() {
  return (
    <main>
      <NavbarLight />
      
      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 lux-hero border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">What We Offer</span>
            <h1 className="mt-2 font-serif text-4xl font-bold text-foreground sm:text-5xl text-balance">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Comprehensive real estate solutions tailored to meet your unique needs. From buying and selling to investment and management, we are here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 lux-section relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative rounded-2xl bg-card p-8 border border-border/70 shadow-[0_14px_40px_-30px_rgba(15,74,60,0.45)] transition-all duration-300 hover:shadow-[0_24px_60px_-32px_rgba(15,74,60,0.55)] hover:border-accent/60 hover:-translate-y-1 cursor-pointer"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <service.icon className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Contact us today to discuss how we can help you achieve your real estate goals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:scale-105 cursor-pointer shadow-xl shadow-black/20"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/20 hover:border-primary-foreground/50 cursor-pointer"
              >
                View Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
