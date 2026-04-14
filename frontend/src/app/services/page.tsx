import Link from "next/link";
import {
  Building2,
  Camera,
  FileText,
  Home,
  Key,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavbarLight } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { connectToDatabase } from "@/lib/db";
import { Service } from "@/models/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const iconPool = [Home, Key, TrendingUp, Building2, Users, FileText, Search, Camera];

export default async function ServicesPage() {
  await connectToDatabase();
  const services = await Service.find().sort({ createdAt: -1 }).lean();
  const safeServices = Array.isArray(services) ? services : [];

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
          {safeServices.length ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {safeServices.map((service: any, index: number) => {
                const Icon = iconPool[index % iconPool.length];
                return (
                  <div
                    key={service._id.toString()}
                    className="group relative rounded-2xl bg-card p-8 border border-border/70 shadow-[0_14px_40px_-30px_rgba(199,163,106,0.4)] transition-all duration-300 hover:shadow-[0_24px_60px_-32px_rgba(199,163,106,0.5)] hover:border-accent/60 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
              No services yet. Check back soon.
            </div>
          )}
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
  );
}
