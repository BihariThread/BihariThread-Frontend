'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, Check, ArrowLeft, Plus } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Address } from '@/types';

type CheckoutStep = 'address' | 'payment';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { user, isLoggedIn, openAuthModal, addAddress } = useAuthStore();

    const [step, setStep] = useState<CheckoutStep>('address');
    const [selectedBillingId, setSelectedBillingId] = useState('');
    const [selectedShippingId, setSelectedShippingId] = useState('');
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addressType, setAddressType] = useState<'billing' | 'shipping'>('shipping');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Address form state
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formLine1, setFormLine1] = useState('');
    const [formLine2, setFormLine2] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formState, setFormState] = useState('');
    const [formPincode, setFormPincode] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            openAuthModal();
        }
    }, [isLoggedIn, openAuthModal]);

    useEffect(() => {
        if (user?.addresses && user.addresses.length > 0) {
            const defaultShip = user.addresses.find(a => a.type === 'shipping' && a.isDefault) || user.addresses[0];
            setSelectedShippingId(defaultShip.id);
            setSelectedBillingId(defaultShip.id);
        }
    }, [user]);

    if (items.length === 0 && !orderPlaced) {
        router.push('/cart');
        return null;
    }

    const subtotal = getTotal();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handleSaveAddress = () => {
        if (!formName || !formPhone || !formLine1 || !formCity || !formState || !formPincode) return;

        const newAddress: Address = {
            id: `addr_${Date.now()}`,
            fullName: formName,
            phone: formPhone,
            addressLine1: formLine1,
            addressLine2: formLine2,
            city: formCity,
            state: formState,
            pincode: formPincode,
            type: addressType,
            isDefault: !user?.addresses.length,
        };

        addAddress(newAddress);
        if (addressType === 'shipping') setSelectedShippingId(newAddress.id);
        else setSelectedBillingId(newAddress.id);

        setShowAddForm(false);
        setFormName(''); setFormPhone(''); setFormLine1(''); setFormLine2('');
        setFormCity(''); setFormState(''); setFormPincode('');
    };

    const handlePlaceOrder = async () => {
        setProcessing(true);
        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2000));
        clearCart();
        setOrderPlaced(true);
        setProcessing(false);
    };

    // Order success screen
    if (orderPlaced) {
        return (
            <LayoutWrapper>
                <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center px-4 page-enter">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                        <Check size={36} className="text-green-600" />
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black text-center">
                        Order Placed!
                    </h1>
                    <p className="font-body text-grey-500 mt-3 text-center max-w-md">
                        Thank you for your order. We&apos;ll send you a confirmation soon.
                    </p>
                    <p className="font-heading text-sm font-bold text-terracotta mt-4">
                        Order #{`BT${Date.now().toString().slice(-6)}`}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button variant="accent" onClick={() => router.push('/shop')}>
                            Continue Shopping
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/profile')}>
                            View Orders
                        </Button>
                    </div>
                </div>
            </LayoutWrapper>
        );
    }

    const addresses = user?.addresses || [];

    return (
        <LayoutWrapper>
            <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto page-enter">
                {/* Back */}
                <button onClick={() => router.back()} className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-widest text-grey-500 hover:text-black transition-colors cursor-pointer mb-8">
                    <ArrowLeft size={14} /> Back
                </button>

                <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black mb-8">
                    Checkout
                </h1>

                {/* Steps Indicator */}
                <div className="flex items-center gap-4 mb-10">
                    {[
                        { id: 'address', label: 'Address', icon: MapPin },
                        { id: 'payment', label: 'Payment', icon: CreditCard },
                    ].map((s, i) => (
                        <React.Fragment key={s.id}>
                            {i > 0 && <div className={`flex-1 h-0.5 ${step === 'payment' ? 'bg-terracotta' : 'bg-grey-200'}`} />}
                            <div className={`flex items-center gap-2 ${step === s.id ? 'text-terracotta' : s.id === 'address' && step === 'payment' ? 'text-green-600' : 'text-grey-400'
                                }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold ${step === s.id ? 'bg-terracotta text-white' : s.id === 'address' && step === 'payment' ? 'bg-green-600 text-white' : 'bg-grey-200 text-grey-500'
                                    }`}>
                                    {s.id === 'address' && step === 'payment' ? <Check size={14} /> : i + 1}
                                </div>
                                <span className="font-heading text-xs font-bold uppercase tracking-widest hidden sm:inline">
                                    {s.label}
                                </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Address */}
                        {step === 'address' && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
                                    Shipping Address
                                </h2>

                                {/* Saved Addresses */}
                                {addresses.length > 0 && (
                                    <div className="space-y-3">
                                        {addresses.map((addr) => (
                                            <label
                                                key={addr.id}
                                                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedShippingId === addr.id ? 'border-terracotta bg-terracotta/5' : 'border-grey-200 hover:border-grey-300 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={selectedShippingId === addr.id}
                                                        onChange={() => {
                                                            setSelectedShippingId(addr.id);
                                                            if (sameAsShipping) setSelectedBillingId(addr.id);
                                                        }}
                                                        className="mt-1 accent-[#C65D3B]"
                                                    />
                                                    <div>
                                                        <p className="font-heading text-sm font-bold">{addr.fullName}</p>
                                                        <p className="font-body text-sm text-grey-500 mt-1">
                                                            {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                                                            {addr.city}, {addr.state} — {addr.pincode}<br />
                                                            Phone: {addr.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Address Button */}
                                <button
                                    onClick={() => { setShowAddForm(true); setAddressType('shipping'); }}
                                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-grey-300 rounded-xl text-grey-500 hover:border-terracotta hover:text-terracotta transition-colors w-full font-heading text-xs font-bold uppercase tracking-widest cursor-pointer"
                                >
                                    <Plus size={16} /> Add New Address
                                </button>

                                {/* Same as shipping checkbox */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={sameAsShipping}
                                        onChange={(e) => setSameAsShipping(e.target.checked)}
                                        className="w-4 h-4 accent-[#C65D3B]"
                                    />
                                    <span className="font-body text-sm text-grey-600">Billing address same as shipping</span>
                                </label>

                                {!sameAsShipping && (
                                    <div className="space-y-3">
                                        <h3 className="font-heading text-sm font-bold uppercase tracking-wider">Billing Address</h3>
                                        {addresses.map((addr) => (
                                            <label key={addr.id} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedBillingId === addr.id ? 'border-terracotta bg-terracotta/5' : 'border-grey-200 hover:border-grey-300 bg-white'
                                                }`}>
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="billing"
                                                        checked={selectedBillingId === addr.id}
                                                        onChange={() => setSelectedBillingId(addr.id)}
                                                        className="mt-1 accent-[#C65D3B]"
                                                    />
                                                    <div>
                                                        <p className="font-heading text-sm font-bold">{addr.fullName}</p>
                                                        <p className="font-body text-xs text-grey-500">{addr.addressLine1}, {addr.city}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                        <button
                                            onClick={() => { setShowAddForm(true); setAddressType('billing'); }}
                                            className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-grey-300 rounded-xl text-grey-500 hover:border-terracotta hover:text-terracotta transition-colors w-full font-heading text-xs font-bold uppercase tracking-widest cursor-pointer"
                                        >
                                            <Plus size={16} /> Add Billing Address
                                        </button>
                                    </div>
                                )}

                                <Button
                                    variant="accent"
                                    size="lg"
                                    fullWidth
                                    onClick={() => setStep('payment')}
                                    disabled={!selectedShippingId}
                                >
                                    Continue to Payment <ArrowLeft size={16} className="ml-2 rotate-180" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 'payment' && (
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="font-heading text-lg font-bold uppercase tracking-wider">
                                    Payment
                                </h2>

                                <div className="bg-white rounded-xl p-6 border border-grey-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CreditCard size={20} className="text-terracotta" />
                                        <span className="font-heading text-sm font-bold uppercase tracking-wider">Cash on Delivery</span>
                                    </div>
                                    <p className="font-body text-sm text-grey-500">
                                        Pay when your order is delivered. No advance payment needed.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setStep('address')}>
                                        <ArrowLeft size={16} className="mr-2" /> Back
                                    </Button>
                                    <Button
                                        variant="accent"
                                        size="lg"
                                        className="flex-1"
                                        onClick={handlePlaceOrder}
                                        loading={processing}
                                    >
                                        Place Order — ₹{total.toLocaleString()}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 sticky top-24">
                            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-black mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-grey-100 rounded-lg overflow-hidden relative shrink-0">
                                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-heading text-xs font-bold truncate">{item.product.name}</p>
                                            <p className="text-xs text-grey-400">× {item.quantity} • {item.size}</p>
                                        </div>
                                        <p className="font-heading text-xs font-bold shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <hr className="border-grey-200 my-4" />
                            <div className="space-y-2 font-body text-sm">
                                <div className="flex justify-between"><span className="text-grey-500">Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-grey-500">Shipping</span><span className={`font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                                <hr className="border-grey-200" />
                                <div className="flex justify-between font-heading font-bold"><span>Total</span><span className="text-lg">₹{total.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Address Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 glass-overlay" onClick={() => setShowAddForm(false)} />
                        <div className="relative w-full max-w-md bg-offwhite rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-6">
                                    Add {addressType === 'billing' ? 'Billing' : 'Shipping'} Address
                                </h3>
                                <div className="space-y-4">
                                    <Input label="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Your name" />
                                    <Input label="Phone" type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Phone number" />
                                    <Input label="Address Line 1" value={formLine1} onChange={(e) => setFormLine1(e.target.value)} placeholder="House no, Street" />
                                    <Input label="Address Line 2" value={formLine2} onChange={(e) => setFormLine2(e.target.value)} placeholder="Landmark (optional)" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="City" value={formCity} onChange={(e) => setFormCity(e.target.value)} placeholder="City" />
                                        <Input label="State" value={formState} onChange={(e) => setFormState(e.target.value)} placeholder="State" />
                                    </div>
                                    <Input label="Pincode" value={formPincode} onChange={(e) => setFormPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pincode" />
                                    <div className="flex gap-3 mt-6">
                                        <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">Cancel</Button>
                                        <Button variant="accent" onClick={handleSaveAddress} className="flex-1">Save Address</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
