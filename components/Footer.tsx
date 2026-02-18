import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Shop: [
      { label: 'All Products', href: '/shop' },
      { label: 'Collections', href: '/shop?category=trending' },
      { label: 'Sale', href: '/shop?sale=true' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
    ],
    About: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/story' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Careers', href: '/careers' },
    ],
    Support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  }

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-primary-foreground/20">
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">Join Our Community</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Get exclusive offers, new collection updates, and Bihari culture insights delivered to your inbox.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 w-full px-4 py-2 rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent border border-transparent focus:border-accent transition-all duration-200"
            />
            <button className="w-full sm:w-auto px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200 shadow-lg shadow-accent/20">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-montserrat font-semibold mb-4 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Brand Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pb-12 border-b border-primary-foreground/20">
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">BihariThread</h3>
            <p className="text-sm text-primary-foreground/70">
              Rooted in Bihar. Worn Everywhere. Celebrating culture through authentic fashion.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin size={18} className="flex-shrink-0" />
              <span className="text-sm text-primary-foreground/70">Patna, Bihar, India</span>
            </div>
            <div className="flex gap-3">
              <Phone size={18} className="flex-shrink-0" />
              <span className="text-sm text-primary-foreground/70">+91 (123) 456-7890</span>
            </div>
            <div className="flex gap-3">
              <Mail size={18} className="flex-shrink-0" />
              <span className="text-sm text-primary-foreground/70">hello@biharithread.com</span>
            </div>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold mb-4 text-sm">Follow Us</h4>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-200 text-sm font-medium"
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/70">
          <p>&copy; {currentYear} BihariThread. All rights reserved.</p>
          <p>Designed & Crafted with Pride</p>
        </div>
      </div>
    </footer>
  )
}
