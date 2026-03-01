'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag, ChevronRight, ArrowLeft, Loader2, Package, Calendar, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/FadeIn';

export default function OrdersPage() {
    const { isLoggedIn, user, orders, fetchOrders } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        const loadOrders = async () => {
            if (isLoggedIn && user) {
                await fetchOrders();
            }
            setLoading(false);
        };
        loadOrders();
    }, [isLoggedIn, user, fetchOrders]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-20" />
                    <h1 className="text-2xl font-bold mb-2">Please login to view your orders</h1>
                    <p className="text-muted-foreground mb-6">You need to be logged in to access your order history.</p>
                    <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                        Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <FadeIn>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">My Orders</h1>
                            <p className="text-muted-foreground mt-1">Track and manage your recent purchases</p>
                        </div>
                        <Link href="/shop" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                            Continue Shopping <ChevronRight size={16} />
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 border border-dashed border-border rounded-3xl">
                            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h2 className="text-xl font-bold">No orders yet</h2>
                            <p className="text-muted-foreground mt-2 mb-8">You haven't placed any orders with us yet.</p>
                            <Link href="/shop" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
                                Explore Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6 border-b border-border bg-muted/5 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Order ID</p>
                                                <p className="text-sm font-black tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Placed On</p>
                                                <p className="text-sm font-bold flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {formatDate(order.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-muted text-muted-foreground'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-border flex-shrink-0">
                                                        <Image
                                                            src={item.product?.image || '/placeholder.png'}
                                                            alt={item.product?.name || 'Product'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="text-sm font-bold truncate">{item.product?.name}</h3>
                                                        <p className="text-[10px] text-muted-foreground">Size: {item.size} | Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-foreground">₹{item.product?.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-muted/5 border-t border-border flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CreditCard size={14} />
                                                <span className="font-medium truncate max-w-[150px]">ID: {order.razorpay_payment_id || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Paid</p>
                                                <p className="text-xl font-black text-primary leading-none">₹{order.total}</p>
                                            </div>
                                            <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-xs font-black transition-colors">
                                                NEED HELP?
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </FadeIn>
            </main>
            <Footer />
        </div>
    );
}
