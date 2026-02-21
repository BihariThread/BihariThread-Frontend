'use client'

import { useState } from 'react'
import { useSiteStore } from '@/store/siteStore'
import { Mail, Phone } from 'lucide-react'

export default function AdminEnquiries() {
  const { enquiries, updateEnquiryStatus } = useSiteStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [quoteAmount, setQuoteAmount] = useState('')

  const selectedEnquiry = enquiries.find((e) => e.id === selectedId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted':
        return 'bg-green-500/20 text-green-700'
      case 'pending':
        return 'bg-orange-500/20 text-orange-700'
      case 'accepted':
        return 'bg-blue-500/20 text-blue-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-foreground">
          Custom Enquiries
        </h1>
        <p className="text-foreground/70 mt-2">{enquiries.length} total enquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Business</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Quantity</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => setSelectedId(enquiry.id)}
                    className={`border-b border-border transition-colors duration-200 cursor-pointer ${selectedId === enquiry.id
                        ? 'bg-accent/10'
                        : 'hover:bg-muted/50'
                      }`}
                  >
                    <td className="py-4 px-6 text-foreground font-medium">{enquiry.id}</td>
                    <td className="py-4 px-6 text-foreground">{enquiry.businessName}</td>
                    <td className="py-4 px-6 text-foreground">{enquiry.quantity} pcs</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          enquiry.status
                        )}`}
                      >
                        {enquiry.status.charAt(0).toUpperCase() +
                          enquiry.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Panel */}
        {selectedEnquiry && (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-montserrat font-bold text-foreground mb-4">
                Details
              </h2>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-foreground/60 uppercase tracking-wider">
                  Contact Person
                </p>
                <p className="text-foreground font-semibold">
                  {selectedEnquiry.contactPerson}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase tracking-wider">
                  Business
                </p>
                <p className="text-foreground font-semibold">
                  {selectedEnquiry.businessName}
                </p>
              </div>
            </div>

            {/* Communication */}
            <div className="border-t border-border pt-4 space-y-3">
              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Phone size={18} className="text-accent" />
                <div>
                  <p className="text-xs text-foreground/60">Phone</p>
                  <p className="text-foreground font-medium">{selectedEnquiry.phone}</p>
                </div>
              </a>
              <a
                href={`mailto:${selectedEnquiry.email}`}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Mail size={18} className="text-accent" />
                <div>
                  <p className="text-xs text-foreground/60">Email</p>
                  <p className="text-foreground font-medium text-sm break-all">
                    {selectedEnquiry.email}
                  </p>
                </div>
              </a>
            </div>

            {/* Quantity */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-foreground/60 uppercase tracking-wider mb-2">
                Quantity
              </p>
              <p className="text-2xl font-bold text-foreground">
                {selectedEnquiry.quantity} pieces
              </p>
            </div>

            {/* Status Update */}
            {selectedEnquiry.status === 'pending' && (
              <div className="border-t border-border pt-4 space-y-3">
                <div>
                  <label className="block text-xs text-foreground/60 uppercase tracking-wider mb-2">
                    Quote Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    placeholder="Enter quote amount"
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={() => {
                    updateEnquiryStatus(selectedEnquiry.id, 'quoted')
                    setQuoteAmount('')
                  }}
                  className="w-full px-4 py-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
                >
                  Send Quote
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
