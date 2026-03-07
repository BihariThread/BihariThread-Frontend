'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, CreditCard, Banknote, Landmark, CheckCircle, ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import FadeIn from '@/components/FadeIn';
import Script from 'next/script';

type CheckoutStep = 'cart' | 'address' | 'payment' | 'success';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const { isLoggedIn, user, openAuthModal, addAddress } = useAuthStore();
    const router = useRouter();
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Autofill address form when opened
    useEffect(() => {
        if (isAddingAddress && user) {
            reset({
                fullName: user.name || '',
                phone: user.phone || '',
                addressLine1: '',
                city: '',
                state: '',
                pincode: ''
            });
        }
    }, [isAddingAddress, user, reset]);

    const total = getTotal();
    const shipping = 0; // Free shipping
    const finalTotal = total + shipping;

    const handleProceedToCheckout = () => {
        if (!isLoggedIn) {
            toast.error('Please login to checkout');
            openAuthModal();
            return;
        }
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        setStep('address');
    };

    const handleAddressSelection = () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }
        setStep('payment');
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }

        const address = user?.addresses.find(a => a.id === selectedAddress);
        if (!address) {
            toast.error('Selected address not found');
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Create order in our backend
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    total: finalTotal,
                    items: items,
                    shippingAddress: address,
                    billingAddress: address, // For now using same for both
                }),
            });

            const orderData = await response.json();

            if (!response.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "BIHARI THREAD",
                description: "Purchase from Bihari Thread",
                image: "/logo.png",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // This is called when payment is successful
                    console.log("Payment Successful:", response);

                    // We can optionally verify here, but the webhook will handle the status update reliably
                    toast.success('Payment successful! Your order is being processed.');

                    // Tell authStore to refetch so it appears in Profile / Orders immediately
                    useAuthStore.getState().fetchOrders();

                    clearCart();
                    setStep('success');
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                notes: {
                    address: `${address.addressLine1}, ${address.city}`,
                    orderId: orderData.orderId
                },
                theme: {
                    color: "#000000" // Pick a color that matches the brand
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                console.error("Payment Failed:", response.error);
                toast.error(response.error.description || 'Payment failed');
                setIsProcessing(false);
            });
            rzp.open();

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    const [isSavingAddress, setIsSavingAddress] = useState(false);

    const onSubmitAddress = async (data: any) => {
        setIsSavingAddress(true);
        try {
            const newAddress = {
                ...data,
                type: 'shipping' as const,
                isDefault: false,
            };
            const savedAddress = await addAddress(newAddress);
            if (savedAddress) {
                setIsAddingAddress(false);
                setSelectedAddress(savedAddress.id);
                toast.success('Address added successfully');
            }
        } catch (error: any) {
            console.error('Failed to save address:', error);
            toast.error(error.message || 'Failed to save address');
        } finally {
            setIsSavingAddress(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4">
                    <FadeIn>
                        <div className="text-center py-12 px-4 max-w-lg mx-auto bg-card border border-border rounded-2xl shadow-sm">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-600 w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-montserrat font-bold text-foreground mb-4">Order Confirmed!</h1>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Thank you for your purchase. Your order has been placed successfully and will be shipped soon.
                            </p>
                            <Link href="/">
                                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all shadow-md">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </FadeIn>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    <div className={`flex items-center gap-2 ${step === 'cart' || step === 'address' || step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</span>
                        <span className="hidden sm:inline font-medium">Cart</span>
                    </div>
                    <div className="w-12 h-[2px] bg-border mx-2"></div>
                    <div className={`flex items-center gap-2 ${step === 'address' || step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</span>
                        <span className="hidden sm:inline font-medium">Details</span>
                    </div>
                    <div className="w-12 h-[2px] bg-border mx-2"></div>
                    <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">3</span>
                        <span className="hidden sm:inline font-medium">Payment</span>
                    </div>
                </div>

                {step === 'cart' && (
                    <FadeIn>
                        <h1 className="text-3xl font-montserrat font-bold text-foreground mb-8">Shopping Cart</h1>
                        {items.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                                <p className="text-xl text-muted-foreground mb-6">Your cart is empty.</p>
                                <Link href="/shop">
                                    <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                                        Browse Products
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    {items.map((item) => (
                                        <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                            <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product.image || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-montserrat font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">Size: {item.size} • Color: {item.color}</p>
                                                    </div>
                                                    <p className="font-bold text-lg">₹{item.product.price * item.quantity}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="flex items-center gap-2 border border-border rounded-md bg-background">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                                            className="p-1.5 hover:bg-muted transition-colors rounded-l-md"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                                            className="p-1.5 hover:bg-muted transition-colors rounded-r-md"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product.id, item.size)}
                                                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-6 h-fit">
                                    <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm sticky top-24">
                                        <h2 className="text-xl font-montserrat font-semibold">Order Summary</h2>
                                        <div className="space-y-2 text-sm pt-4 border-t border-border">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span>₹{total}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Shipping</span>
                                                <span className="text-green-600 font-medium">Free</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₹{finalTotal}</span>
                                        </div>
                                        <button
                                            onClick={handleProceedToCheckout}
                                            className="w-full bg-accent text-accent-foreground py-3.5 rounded-full font-bold hover:opacity-90 transition-transform active:scale-95 shadow-lg shadow-accent/20"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </FadeIn>
                )}

                {step === 'address' && (
                    <FadeIn>
                        <button onClick={() => setStep('cart')} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Cart
                        </button>
                        <h1 className="text-3xl font-montserrat font-bold text-foreground mb-8">Shipping Address</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {user?.addresses && user.addresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => setSelectedAddress(addr.id)}
                                                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-start gap-4 ${selectedAddress === addr.id
                                                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                                                    : 'border-border hover:border-accent/50 hover:bg-muted/30'
                                                    }`}
                                            >
                                                <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-accent' : 'border-muted-foreground'}`}>
                                                    {selectedAddress === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{addr.fullName}</p>
                                                    <p className="text-muted-foreground text-sm mt-1">{addr.addressLine1}, {addr.city}</p>
                                                    <p className="text-muted-foreground text-sm">{addr.state} - {addr.pincode}</p>
                                                    <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1"><span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded">Mobile</span> {addr.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !isAddingAddress && (
                                        <div className="text-center py-10 border border-dashed border-border rounded-xl bg-muted/10">
                                            <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                            <p className="text-muted-foreground">No addresses saved yet.</p>
                                        </div>
                                    )
                                )}

                                {isAddingAddress ? (
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        <h3 className="font-bold mb-4">Add New Address</h3>
                                        <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <input {...register('fullName', { required: true })} placeholder="Full Name" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                                    {errors.fullName && <span className="text-xs text-red-500">Required</span>}
                                                </div>
                                                <div className="space-y-1">
                                                    <input {...register('phone', { required: true })} placeholder="Phone Number" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                                    {errors.phone && <span className="text-xs text-red-500">Required</span>}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <input {...register('addressLine1', { required: true })} placeholder="Address (House No, Building, Street, Area)" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                                {errors.addressLine1 && <span className="text-xs text-red-500">Required</span>}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <input {...register('city', { required: true })} placeholder="City" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                                <input {...register('state', { required: true })} placeholder="State" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                                <input {...register('pincode', { required: true })} placeholder="Pincode" className="w-full p-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSavingAddress}
                                                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {isSavingAddress ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={18} /> Saving...
                                                        </>
                                                    ) : (
                                                        'Save Address'
                                                    )}
                                                </button>
                                                <button type="button" onClick={() => setIsAddingAddress(false)} className="flex-1 border border-border py-2.5 rounded-lg font-medium hover:bg-muted text-muted-foreground disabled:opacity-50" disabled={isSavingAddress}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="w-full border border-dashed border-border py-4 rounded-xl text-primary font-medium hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} /> Add New Address
                                    </button>
                                )}
                            </div>

                            <div className="bg-card border border-border rounded-xl p-6 h-fit shadow-sm lg:col-span-1">
                                <h2 className="text-xl font-montserrat font-semibold mb-4">Price Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total MRP</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Discount on MRP</span>
                                        <span className="text-green-600">-₹0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping Fee</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-4 mt-4 flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                                <button
                                    onClick={handleAddressSelection}
                                    disabled={!selectedAddress}
                                    className="w-full bg-accent text-accent-foreground py-3.5 rounded-full font-bold mt-6 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {step === 'payment' && (
                    <FadeIn>
                        <button onClick={() => setStep('address')} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                            <ArrowLeft size={16} className="mr-2" /> Back to Address
                        </button>
                        <h1 className="text-3xl font-montserrat font-bold text-foreground mb-8">Choose Payment Mode</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-6 border rounded-xl cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:bg-muted/30'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Banknote size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg">Cash on Delivery</h3>
                                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-accent' : 'border-muted-foreground'}`}>
                                        {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-accent" />}
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-6 border rounded-xl cursor-pointer flex items-center gap-4 transition-all opacity-75 hover:opacity-100 ${paymentMethod === 'upi' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:bg-muted/30'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Landmark size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg">UPI (Google Pay / PhonePe)</h3>
                                        <p className="text-sm text-muted-foreground">Instant payment using UPI App</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-accent' : 'border-muted-foreground'}`}>
                                        {paymentMethod === 'upi' && <div className="w-3 h-3 rounded-full bg-accent" />}
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-6 border rounded-xl cursor-pointer flex items-center gap-4 transition-all opacity-75 hover:opacity-100 ${paymentMethod === 'card' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:bg-muted/30'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <CreditCard size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg">Credit / Debit Card</h3>
                                        <p className="text-sm text-muted-foreground">Secure payment via cards</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-accent' : 'border-muted-foreground'}`}>
                                        {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-accent" />}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-6 h-fit shadow-lg shadow-primary/5 lg:col-span-1">
                                <h2 className="text-xl font-montserrat font-semibold mb-4">Final Summary</h2>
                                <div className="space-y-3 text-sm pb-4 border-b border-border">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                </div>
                                <div className="py-4 flex justify-between font-bold text-xl">
                                    <span>To Pay</span>
                                    <span>₹{finalTotal}</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground mb-4">
                                    By placing this order, you agree to our Terms of Service and Privacy Policy.
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full bg-accent text-accent-foreground py-4 rounded-full font-bold hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-wait shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                )}
            </main>
            <Footer />
        </div>
    );
}
