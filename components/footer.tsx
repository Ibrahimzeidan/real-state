import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/news", label: "News" },
    { href: "#", label: "FAQ" },
    { href: "#", label: "Support" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block cursor-pointer group">
              <span className="text-2xl font-serif font-bold transition-colors group-hover:text-accent">
                PrimeNest<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Premium real estate services for discerning clients. We help you find your dream property with expertise and dedication.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-all duration-200 hover:text-primary-foreground hover:translate-x-1 inline-block cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-all duration-200 hover:text-primary-foreground hover:translate-x-1 inline-block cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70 group cursor-pointer hover:text-primary-foreground transition-colors">
                <MapPin className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" />
                <span>123 Estate Avenue, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70 group cursor-pointer hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70 group cursor-pointer hover:text-primary-foreground transition-colors">
                <Mail className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" />
                <span>hello@primenest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} PrimeNest Estates. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
