'use client'

import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { ChevronDown, Search, Filter, Eye, MoreHorizontal, X } from 'lucide-react'

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useSiteStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredOrders = orders.filter(order => {
    const customerName = order.customerName || (order.shippingAddress as any)?.fullName || 'Anonymous';
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: any) => {
    const d = new Date(date)
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'not accepted':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="not accepted">Not Accepted</option>
          </select>
          <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Order ID</th>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-muted-foreground">Amount</th>
                <th className="text-center py-4 px-6 font-semibold text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors duration-200"
                >
                  <td className="py-4 px-6 font-medium text-foreground">#{order.id}</td>
                  <td className="py-4 px-6 text-foreground">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customerName || (order.shippingAddress as any)?.fullName || 'Anonymous'}</span>
                      {order.items && order.items.length > 0 ? (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => item.product?.image && setSelectedImage(item.product.image)}
                                className="w-12 h-12 rounded-full border-2 border-background overflow-hidden relative bg-muted shadow-sm hover:z-20 transition-transform hover:scale-110 cursor-pointer"
                                title={`${item.product?.name} (${item.size})`}
                              >
                                {item.product?.image ? (
                                  <img src={item.product?.image} alt="" className="object-cover w-full h-full" />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full text-xs text-muted-foreground">?</span>
                                )}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold z-10 shadow-sm">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{order.items.length} items</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">0 items</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-foreground font-semibold">₹{order.total}</td>
                  <td className="py-4 px-6 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer appearance-none text-center min-w-[100px] ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="not accepted">Not Accepted</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center items-center">
            <button
              className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
              onClick={() => setSelectedImage(null)}
              title="Close"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Product View"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
