'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LiveConfig } from '@/lib/site-config'

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Properties',
    href: '/properties',
    children: [
      { label: 'All Properties', href: '/properties' },
      { label: 'Residential', href: '/properties?type=RESIDENTIAL' },
      { label: 'Commercial', href: '/properties?type=COMMERCIAL' },
      { label: 'Luxury Villas', href: '/properties?type=VILLA&luxury=true' },
      { label: 'Plots', href: '/properties?type=PLOT' },
      { label: 'Rental', href: '/properties?purpose=RENT' },
      { label: 'Investment', href: '/properties?purpose=INVESTMENT' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Investment Advisory', href: '/investment' },
      { label: 'NRI Investment', href: '/nri' },
      { label: 'Property Management', href: '/services' },
    ],
  },
  { label: 'Blogs', href: '/blogs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

interface NavbarProps {
  config?: LiveConfig
}

export function Navbar({ config }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const phone = config?.phonePrimary || '+918872520002'
  const phoneLink = `tel:${phone.replace(/\s/g, '')}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navBg = isHome
    ? isScrolled
      ? 'bg-charcoal-950/95 backdrop-blur-xl border-b border-white/10'
      : 'bg-transparent'
    : 'bg-charcoal-950/95 backdrop-blur-xl border-b border-white/10'

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', navBg)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold-gradient rounded-sm flex items-center justify-center shadow-gold">
              <span className="text-white font-heading font-bold text-lg">3S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-heading font-bold text-xl leading-none">
                3S Real Estate
              </span>
              <span className="text-gold-400 text-xs tracking-widest">
                SMART • SECURE • SOPHISTICATED
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-sm transition-colors',
                    pathname === link.href ? 'text-gold-400' : 'text-white/80 hover:text-white'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                </Link>

                <AnimatePresence>
                  {link.children && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-charcoal-900 border border-white/10 rounded-lg shadow-luxury overflow-hidden"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={phoneLink}
              className="flex items-center gap-2 text-white/80 hover:text-gold-400 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
            <Link
              href="/contact"
              className="bg-gold-gradient text-white font-semibold px-5 py-2.5 rounded-sm text-sm hover:shadow-gold transition-all"
            >
              Get Free Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-charcoal-950 border-t border-white/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      pathname === link.href
                        ? 'text-gold-400 bg-gold-500/10'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <div className="ml-4 border-l border-white/10 pl-4 mt-1 mb-2 flex flex-col gap-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block px-3 py-2 text-xs text-white/50 hover:text-white/80 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                <a href={phoneLink} className="flex items-center gap-2 text-white/80 px-4">
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span className="text-sm">{phone}</span>
                </a>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="bg-gold-gradient text-white font-semibold text-center text-sm py-3 rounded-lg"
                >
                  Get Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}