'use client'

import { mockOrders, mockEnquiries, mockProducts, mockUsers } from '@/lib/mock-data'
import { TrendingUp, ShoppingCart, AlertCircle, Users as UsersIcon, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = mockOrders.filter((o) => o.status === 'processing').length
  const pendingEnquiries = mockEnquiries.filter((e) => e.status === 'pending').length

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Total Orders',
      value: mockOrders.length,
      change: '+5.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Active Users',
      value: mockUsers.length,
      change: '-2.1%',
      trend: 'down',
      icon: UsersIcon,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Products',
      value: mockProducts.length,
      change: '0%',
      trend: 'neutral',
      icon: Package,
      color: 'bg-orange-500/10 text-orange-600',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Overview of your store's performance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700' :
                  stat.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : stat.trend === 'down' ? <ArrowDownRight size={14} className="mr-1" /> : null}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
              <p className="text-2xl font-montserrat font-bold text-foreground mt-1">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-montserrat font-bold text-foreground">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-200">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4 text-right font-medium">₹{order.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Enquiries */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-montserrat font-bold text-foreground">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-accent hover:underline">View All</Link>
          </div>
          <div className="flex-1 space-y-4">
            {mockEnquiries.slice(0, 4).map((enquiry) => (
              <div key={enquiry.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-xs">{enquiry.businessName.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm truncate">{enquiry.businessName}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${enquiry.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{enquiry.email}</p>
                  <p className="text-xs text-foreground/80 mt-1 line-clamp-1">{enquiry.message}</p>
                </div>
              </div>
            ))}
            {mockEnquiries.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">No recent enquiries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
