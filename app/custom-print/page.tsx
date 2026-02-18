'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Upload, Send } from 'lucide-react'

export default function CustomPrint() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedQuantity: '',
    notes: '',
  })
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const availableDesigns = [
    'Heritage Classic',
    'Modern Funky',
    'Sports Edition',
    'Corporate Branding',
    'Festival Special',
    'Minimal Design',
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDesignToggle = (design: string) => {
    setSelectedDesigns((prev) =>
      prev.includes(design) ? prev.filter((d) => d !== design) : [...prev, design]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { ...formData, selectedDesigns })
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        businessName: '',
        contactPerson: '',
        phone: '',
        email: '',
        estimatedQuantity: '',
        notes: '',
      })
      setSelectedDesigns([])
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <div className="bg-muted py-8 md:py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-foreground mb-2">
            Custom Print Enquiry
          </h1>
          <p className="text-foreground/70 text-lg">
            Looking for bulk orders? Let's create something special together.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: 'Competitive Pricing', desc: 'Best rates for bulk orders' },
            { title: 'Custom Designs', desc: 'Bring your brand vision to life' },
            { title: 'Quick Turnaround', desc: 'Fast production & delivery' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                ✓
              </div>
              <h3 className="font-montserrat font-bold text-lg text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-foreground/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Enquiry Form */}
        <div className="bg-card rounded-lg border border-border p-8 md:p-12">
          {isSubmitted ? (
            <div className="text-center py-12 animate-fadeUp">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                ✓
              </div>
              <h2 className="text-2xl font-montserrat font-bold text-foreground mb-2">
                Enquiry Submitted Successfully!
              </h2>
              <p className="text-foreground/70 mb-6">
                Our team will reach out to you within 24 hours with a custom quote.
              </p>
              <p className="text-sm text-foreground/50">Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-xl font-montserrat font-bold text-foreground mb-6">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Full name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-montserrat font-bold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="+91 (123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="business@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-xl font-montserrat font-bold text-foreground mb-6">
                  Order Details
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Estimated Quantity *
                  </label>
                  <input
                    type="number"
                    name="estimatedQuantity"
                    value={formData.estimatedQuantity}
                    onChange={handleInputChange}
                    required
                    min="50"
                    className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Minimum 50 pieces"
                  />
                  <p className="text-xs text-foreground/50 mt-2">Minimum order: 50 pieces</p>
                </div>
              </div>

              {/* Design Selection */}
              <div>
                <h3 className="text-xl font-montserrat font-bold text-foreground mb-6">
                  Available Design Templates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {availableDesigns.map((design) => (
                    <label
                      key={design}
                      className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDesigns.includes(design)}
                        onChange={() => handleDesignToggle(design)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-foreground font-medium">{design}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-xl font-montserrat font-bold text-foreground mb-6">
                  Upload Your Design (Optional)
                </h3>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors duration-200 cursor-pointer group">
                  <Upload size={32} className="mx-auto text-accent mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <p className="font-semibold text-foreground mb-2">
                    Drag and drop your design here
                  </p>
                  <p className="text-sm text-foreground/70">or click to browse files</p>
                  <p className="text-xs text-foreground/50 mt-2">
                    Supported: PDF, AI, PSD, PNG, JPG (Max 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.ai,.psd,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Tell us more about your requirements, preferences, or any special requests..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Send size={20} />
                  Submit Enquiry
                </button>
                <p className="text-xs text-foreground/50 text-center mt-4">
                  We'll review your request and send you a custom quote within 24 hours.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
