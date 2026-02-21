'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Users,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounting, setIsMounting] = useState(true)
  const { isAdminLoggedIn, adminLogout } = useAuthStore()

  useEffect(() => {
    setIsMounting(false)
    if (!isAdminLoggedIn && pathname !== '/admin') {
      router.push('/admin')
    }
  }, [isAdminLoggedIn, pathname, router])

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Settings, label: 'Categories', href: '/admin/categories' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: MessageSquare, label: 'Enquiries', href: '/admin/enquiries' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Site Settings', href: '/admin/settings' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = () => {
    adminLogout()
    router.push('/admin')
  }

  if (isMounting) return null;

  // If not logged in and not on login page, don't show layout content
  if (!isAdminLoggedIn && pathname !== '/admin') {
    return null
  }

  // If on login page, don't show the sidebar layout
  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-2xl font-montserrat font-bold text-primary">
              BIHARITHREAD<span className="text-accent">ADMIN</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                    ? 'bg-primary text-primary-foreground font-medium shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <Icon size={20} className={active ? '' : 'group-hover:text-accent transition-colors'} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 md:hidden bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <h1 className="font-montserrat font-bold text-foreground">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <Menu size={24} className="text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
