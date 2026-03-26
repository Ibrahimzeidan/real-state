"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Menu, UserCircle2, X } from "lucide-react"

import { useCurrentUser } from "@/hooks/use-current-user"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user } = useCurrentUser()

  const dashboardLink =
    user?.role === "ADMIN"
      ? { href: "/admin", label: "Admin" }
      : user?.role === "BLOG_EDITOR"
        ? { href: "/editor/blogs", label: "Editor" }
        : user?.role === "PROJECT_EDITOR"
          ? { href: "/editor/projects", label: "Editor" }
          : null

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.replace("/login")
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-[#0F141A]/80 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-2xl font-serif font-bold text-white transition-colors group-hover:text-white/80">
              Ibrahim company<span className="text-white/70">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:text-white cursor-pointer rounded-lg hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {dashboardLink ? (
              <Link
                href={dashboardLink.href}
                className="relative px-4 py-2 text-sm font-semibold text-accent transition-all duration-200 hover:text-accent/80 cursor-pointer rounded-lg hover:bg-white/10"
              >
                {dashboardLink.label}
              </Link>
            ) : null}
            <Link
              href="/contact"
              className="ml-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:scale-105 cursor-pointer shadow-lg shadow-black/20"
            >
              Get Started
            </Link>
            <div className="ml-4 flex items-center gap-2">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition-all duration-200 hover:bg-white/15"
              >
                <UserCircle2 className="h-4 w-4 text-accent" />
                {user?.name ? user.name : "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent/90"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-[#0F141A]/95 backdrop-blur-md rounded-xl mt-2 p-4 border border-white/10 shadow-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-white/80 transition-all duration-200 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              {dashboardLink ? (
                <Link
                  href={dashboardLink.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-accent transition-all duration-200 hover:text-accent/80 hover:bg-white/10 py-3 px-4 rounded-lg cursor-pointer"
                >
                  {dashboardLink.label} dashboard
                </Link>
              ) : null}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent/90 cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                <UserCircle2 className="h-4 w-4 text-accent" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:bg-accent/90"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export function NavbarLight() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user } = useCurrentUser()

  const dashboardLink =
    user?.role === "ADMIN"
      ? { href: "/admin", label: "Admin" }
      : user?.role === "BLOG_EDITOR"
        ? { href: "/editor/blogs", label: "Editor" }
        : user?.role === "PROJECT_EDITOR"
          ? { href: "/editor/projects", label: "Editor" }
          : null

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <span className="text-2xl font-serif font-bold text-foreground transition-colors group-hover:text-primary">
              Ibrahim company<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground cursor-pointer rounded-lg hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            {dashboardLink ? (
              <Link
                href={dashboardLink.href}
                className="relative px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:text-primary/80 cursor-pointer rounded-lg hover:bg-secondary"
              >
                {dashboardLink.label}
              </Link>
            ) : null}
            <Link
              href="/contact"
              className="ml-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105 cursor-pointer shadow-lg shadow-primary/25"
            >
              Get Started
            </Link>
            <div className="ml-4 flex items-center gap-2">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-secondary"
              >
                <UserCircle2 className="h-4 w-4 text-primary" />
                {user?.name ? user.name : "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground cursor-pointer hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-card border border-border rounded-xl mt-2 p-4 shadow-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary py-3 px-4 rounded-lg cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
              {dashboardLink ? (
                <Link
                  href={dashboardLink.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-primary transition-all duration-200 hover:text-primary/80 hover:bg-secondary py-3 px-4 rounded-lg cursor-pointer"
                >
                  {dashboardLink.label} dashboard
                </Link>
              ) : null}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 cursor-pointer"
              >
                Get Started
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-secondary"
              >
                <UserCircle2 className="h-4 w-4 text-primary" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
