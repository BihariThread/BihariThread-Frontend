import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { ChevronDown, Search, Filter, Eye, MoreHorizontal } from 'lucide-react'

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useSiteStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order as any).customerName?.toLowerCase().includes(searchQuery.toLowerCase());
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
                      <span className="font-medium">{(order as any).customerName || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">{order.items.length} items</span>
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
    </div>
  )
}
