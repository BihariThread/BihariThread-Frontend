import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { Mail, ShoppingBag, Search, Phone, MapPin, Calendar } from 'lucide-react'

export default function AdminUsers() {
  const { users, orders } = useSiteStore()
  const [searchQuery, setSearchQuery] = useState('')

  const getUserOrders = (userId: string) => {
    return orders.filter((order) => {
      const user = users.find((u) => u.id === userId)
      return user && (order as any).customerName === user.name
    })
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: any) => {
    const d = new Date(date)
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-foreground">
            Users
          </h1>
          <p className="text-muted-foreground mt-1">Manage registered users ({users.length})</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userOrders = getUserOrders(user.id)
          const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)

          return (
            <div
              key={user.id}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-foreground">
                      {user.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail size={14} />
                  {user.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone size={14} />
                  {/* Mock phone since it's not in type yet, or use generic */}
                  +91 98765 43210
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar size={14} />
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 bg-muted/30 -mx-6 -mb-6 p-6 mt-auto">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Orders
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {userOrders.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Total Spent
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    ₹{totalSpent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
