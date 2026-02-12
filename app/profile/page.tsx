'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Paintbrush, User, LogOut, MapPin, Plus, Trash2 } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { Address } from '@/types';

type Tab = 'orders' | 'custom' | 'account';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoggedIn, logout, updateUser, addAddress, removeAddress, openAuthModal } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formLine1, setFormLine1] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formState, setFormState] = useState('');
    const [formPincode, setFormPincode] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            openAuthModal();
        }
    }, [isLoggedIn, openAuthModal]);

    useEffect(() => {
        if (user) {
            setEditName(user.name);
            setEditEmail(user.email);
        }
    }, [user]);

    if (!isLoggedIn || !user) {
        return (
            <LayoutWrapper>
                <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center px-4">
                    <h1 className="font-heading text-2xl font-black uppercase tracking-wider text-black">
                        Please Login
                    </h1>
                    <p className="font-body text-grey-500 mt-3">Sign in to view your profile.</p>
                    <Button variant="accent" className="mt-6" onClick={openAuthModal}>
                        Login / Sign Up
                    </Button>
                </div>
            </LayoutWrapper>
        );
    }

    const handleSaveProfile = () => {
        updateUser({ name: editName, email: editEmail });
    };

    const handleAddAddress = () => {
        if (!formName || !formPhone || !formLine1 || !formCity || !formState || !formPincode) return;
        const newAddr: Address = {
            id: `addr_${Date.now()}`,
            fullName: formName,
            phone: formPhone,
            addressLine1: formLine1,
            addressLine2: '',
            city: formCity,
            state: formState,
            pincode: formPincode,
            type: 'shipping',
            isDefault: user.addresses.length === 0,
        };
        addAddress(newAddr);
        setShowAddAddress(false);
        setFormName(''); setFormPhone(''); setFormLine1('');
        setFormCity(''); setFormState(''); setFormPincode('');
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const tabs = [
        { id: 'orders' as Tab, label: 'Orders', icon: Package },
        { id: 'custom' as Tab, label: 'Custom Orders', icon: Paintbrush },
        { id: 'account' as Tab, label: 'Account', icon: User },
    ];

    // Mock orders
    const mockOrders = [
        { id: 'BT001234', date: '2026-02-08', total: 2798, status: 'delivered', items: 2 },
        { id: 'BT001210', date: '2026-02-05', total: 1499, status: 'shipped', items: 1 },
    ];

    const mockCustomOrders = [
        { id: 'CP004521', date: '2026-02-09', status: 'pending', qty: 5 },
    ];

    return (
        <LayoutWrapper>
            <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto page-enter">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-terracotta font-heading text-xs font-bold uppercase tracking-[0.2em] mb-2">My Account</p>
                        <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
                            Hey, {user.name.split(' ')[0]}!
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-grey-500 hover:text-red-600 hover:bg-red-50 transition-all font-heading text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-heading text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-black text-white'
                                    : 'text-grey-500 hover:text-black hover:bg-grey-100'
                                }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4 animate-fade-in">
                        {mockOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="font-heading text-sm font-bold">Order #{order.id}</p>
                                    <p className="font-body text-xs text-grey-500 mt-1">{order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <span className="font-heading text-sm font-bold">₹{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Orders Tab */}
                {activeTab === 'custom' && (
                    <div className="space-y-4 animate-fade-in">
                        {mockCustomOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="font-heading text-sm font-bold">Custom #{order.id}</p>
                                    <p className="font-body text-xs text-grey-500 mt-1">{order.date} • Qty: {order.qty}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest bg-yellow-100 text-yellow-700">
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Personal Info */}
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="font-heading text-sm font-bold uppercase tracking-widest mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                <Input label="Email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                                <Input label="Phone" value={user.phone} disabled />
                            </div>
                            <Button variant="accent" className="mt-6" onClick={handleSaveProfile}>
                                Save Changes
                            </Button>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-heading text-sm font-bold uppercase tracking-widest">Addresses</h3>
                                <button
                                    onClick={() => setShowAddAddress(true)}
                                    className="flex items-center gap-1 text-terracotta font-heading text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-deep-maroon transition-colors"
                                >
                                    <Plus size={14} /> Add
                                </button>
                            </div>

                            {user.addresses.length === 0 ? (
                                <p className="font-body text-sm text-grey-400">No addresses saved yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {user.addresses.map((addr) => (
                                        <div key={addr.id} className="flex items-start justify-between p-4 bg-offwhite rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-terracotta mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-heading text-sm font-bold">{addr.fullName}</p>
                                                    <p className="font-body text-xs text-grey-500 mt-1">
                                                        {addr.addressLine1}, {addr.city}, {addr.state} — {addr.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAddress(addr.id)}
                                                className="p-1.5 text-grey-400 hover:text-red-500 transition-colors cursor-pointer"
                                                aria-label="Delete address"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {showAddAddress && (
                                <div className="mt-6 p-4 bg-offwhite rounded-xl space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input label="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Name" />
                                        <Input label="Phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Phone" />
                                    </div>
                                    <Input label="Address" value={formLine1} onChange={(e) => setFormLine1(e.target.value)} placeholder="Street address" />
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input label="City" value={formCity} onChange={(e) => setFormCity(e.target.value)} placeholder="City" />
                                        <Input label="State" value={formState} onChange={(e) => setFormState(e.target.value)} placeholder="State" />
                                        <Input label="Pincode" value={formPincode} onChange={(e) => setFormPincode(e.target.value)} placeholder="Pincode" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                                        <Button variant="accent" onClick={handleAddAddress}>Save</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
