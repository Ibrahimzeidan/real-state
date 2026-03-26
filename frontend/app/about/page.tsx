import Image from "next/image"
import Link from "next/link"
import { NavbarLight } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Users, Award, Home, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"

const stats = [
  { label: "Years Experience", value: "25+", icon: Award },
  { label: "Properties Sold", value: "2,500+", icon: Home },
  { label: "Happy Clients", value: "3,200+", icon: Users },
  { label: "Growth Rate", value: "98%", icon: TrendingUp },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    description: "With over 20 years of experience in luxury real estate, Sarah leads our team with vision and expertise.",
  },
  {
    name: "Michael Chen",
    role: "Senior Agent",
    description: "Specializing in residential properties and investments, Michael has closed over 500 successful deals.",
  },
  {
    name: "Emily Rodriguez",
    role: "Property Manager",
    description: "Expert in property management and client relations, Emily ensures seamless property experiences.",
  },
]

const values = [
  {
    title: "Integrity",
    description: "We believe in honest, transparent communication in every interaction. Your trust is our most valuable asset.",
    icon: CheckCircle,
  },
  {
    title: "Excellence",
    description: "We strive for excellence in everything we do, from property selection to client service delivery.",
    icon: Award,
  },
  {
    title: "Innovation",
    description: "We embrace new technologies and approaches to deliver the best possible experience for our clients.",
    icon: TrendingUp,
  },
]

export default function AboutPage() {
  return (
    <main>
      <NavbarLight />
      
      {/* Hero Section */}
      <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 lux-hero border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">About Us</span>
              <h1 className="mt-2 font-serif text-4xl font-bold text-foreground sm:text-5xl text-balance">
                Your Trusted Partner in Real Estate
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Founded in 1999, PrimeNest Estates has been at the forefront of premium real estate services for over two decades. We believe that finding the perfect property is about more than just bricks and mortar - it is about finding a place where life happens.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our team of dedicated professionals combines local expertise with global reach to deliver exceptional results for our clients. Whether you are buying your first home, selling a luxury property, or building an investment portfolio, we are here to guide you every step of the way.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 cursor-pointer shadow-lg shadow-primary/25"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/about-team.jpg"
                alt="Our team at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group cursor-pointer">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/10 transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
                  <stat.icon className="h-7 w-7 text-primary-foreground transition-colors" />
                </div>
                <p className="mt-4 text-3xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 lux-section relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Values</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              The Principles That Guide Us
            </h2>
            <p className="mt-4 text-muted-foreground">
              These core values shape every interaction and decision we make.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group relative rounded-2xl bg-card p-8 border border-border/70 shadow-[0_14px_40px_-30px_rgba(199,163,106,0.4)] text-center transition-all duration-300 hover:shadow-[0_24px_60px_-32px_rgba(199,163,106,0.5)] hover:border-accent/60 hover:-translate-y-1 cursor-pointer"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                  <value.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{value.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28 lux-section-alt relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Team</span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Meet the Experts
            </h2>
            <p className="mt-4 text-muted-foreground">
              Experienced professionals dedicated to your success in real estate.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative rounded-2xl bg-card p-8 border border-border/70 shadow-[0_14px_40px_-30px_rgba(199,163,106,0.4)] text-center transition-all duration-300 hover:shadow-[0_24px_60px_-32px_rgba(199,163,106,0.5)] hover:border-accent/60 hover:-translate-y-1 cursor-pointer"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 lux-section relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-primary px-8 py-16 text-center sm:px-16">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Work With Us?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
              Let us help you find your dream property or achieve your real estate goals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:scale-105 cursor-pointer shadow-xl shadow-black/20"
              >
                Contact Us Today
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
