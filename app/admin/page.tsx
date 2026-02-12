'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Paintbrush, Plus, Edit, Trash2, Eye } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import Button from '@/components/Button';
import { products } from '@/lib/api';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'custom';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const tabs = [
        { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products' as AdminTab, label: 'Products', icon: Package },
        { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingCart },
        { id: 'custom' as AdminTab, label: 'Custom Orders', icon: Paintbrush },
    ];

    const mockOrders = [
        { id: 'BT001234', customer: 'Rahul Kumar', total: 2798, status: 'confirmed', date: '2026-02-10' },
        { id: 'BT001233', customer: 'Priya Singh', total: 1499, status: 'shipped', date: '2026-02-09' },
        { id: 'BT001232', customer: 'Amit Verma', total: 4097, status: 'delivered', date: '2026-02-08' },
        { id: 'BT001231', customer: 'Sneha Das', total: 1299, status: 'pending', date: '2026-02-08' },
    ];

    const mockCustomOrders = [
        { id: 'CP004521', customer: 'Vikas Jha', qty: 5, status: 'pending', date: '2026-02-09' },
        { id: 'CP004520', customer: 'Anita Kumari', qty: 10, status: 'quoted', date: '2026-02-07' },
    ];

    const stats = [
        { label: 'Total Orders', value: '148', change: '+12%' },
        { label: 'Revenue', value: '₹2.1L', change: '+8%' },
        { label: 'Products', value: products.length.toString(), change: '' },
        { label: 'Custom Orders', value: '23', change: '+5%' },
    ];

    return (
        <LayoutWrapper>
            <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-enter">
                <div className="mb-8">
                    <p className="text-terracotta font-heading text-xs font-bold uppercase tracking-[0.2em] mb-2">Management</p>
                    <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
                        Admin Panel
                    </h1>
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

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white rounded-xl p-5">
                                    <p className="font-body text-xs text-grey-500 uppercase tracking-wider">{stat.label}</p>
                                    <p className="font-heading text-2xl font-black mt-1">{stat.value}</p>
                                    {stat.change && <p className="text-xs text-green-600 font-heading font-bold mt-1">{stat.change}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="font-heading text-sm font-bold uppercase tracking-widest mb-4">Recent Orders</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-grey-200">
                                            <th className="text-left py-3 font-heading text-xs uppercase tracking-widest text-grey-500">ID</th>
                                            <th className="text-left py-3 font-heading text-xs uppercase tracking-widest text-grey-500">Customer</th>
                                            <th className="text-left py-3 font-heading text-xs uppercase tracking-widest text-grey-500">Total</th>
                                            <th className="text-left py-3 font-heading text-xs uppercase tracking-widest text-grey-500">Status</th>
                                            <th className="text-left py-3 font-heading text-xs uppercase tracking-widest text-grey-500">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-grey-100">
                                                <td className="py-3 font-heading text-xs font-bold">#{order.id}</td>
                                                <td className="py-3 font-body">{order.customer}</td>
                                                <td className="py-3 font-heading font-bold">₹{order.total.toLocaleString()}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        }`}>{order.status}</span>
                                                </td>
                                                <td className="py-3 font-body text-grey-500">{order.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <p className="font-body text-sm text-grey-500">{products.length} products</p>
                            <Button variant="accent" size="sm"><Plus size={14} className="mr-1" /> Add Product</Button>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-grey-200 bg-grey-100">
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Product</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Category</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Price</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Stock</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-grey-100 hover:bg-grey-100/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-grey-100 relative shrink-0">
                                                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <span className="font-heading text-xs font-bold">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-body text-grey-500 capitalize">{product.category}</td>
                                                <td className="py-3 px-4 font-heading font-bold">₹{product.price.toLocaleString()}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>{product.inStock ? 'In Stock' : 'Out'}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-1">
                                                        <button className="p-1.5 hover:bg-grey-200 rounded-lg transition-colors cursor-pointer"><Eye size={14} className="text-grey-500" /></button>
                                                        <button className="p-1.5 hover:bg-grey-200 rounded-lg transition-colors cursor-pointer"><Edit size={14} className="text-grey-500" /></button>
                                                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={14} className="text-red-400" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in">
                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-grey-200 bg-grey-100">
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Order ID</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Customer</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Total</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Status</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Date</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-grey-100 hover:bg-grey-100/50">
                                                <td className="py-3 px-4 font-heading text-xs font-bold">#{order.id}</td>
                                                <td className="py-3 px-4 font-body">{order.customer}</td>
                                                <td className="py-3 px-4 font-heading font-bold">₹{order.total.toLocaleString()}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                        }`}>{order.status}</span>
                                                </td>
                                                <td className="py-3 px-4 font-body text-grey-500">{order.date}</td>
                                                <td className="py-3 px-4">
                                                    <button className="p-1.5 hover:bg-grey-200 rounded-lg transition-colors cursor-pointer"><Eye size={14} className="text-grey-500" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Orders */}
                {activeTab === 'custom' && (
                    <div className="animate-fade-in">
                        <div className="bg-white rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-grey-200 bg-grey-100">
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">ID</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Customer</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Qty</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Status</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Date</th>
                                            <th className="text-left py-3 px-4 font-heading text-xs uppercase tracking-widest text-grey-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockCustomOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-grey-100 hover:bg-grey-100/50">
                                                <td className="py-3 px-4 font-heading text-xs font-bold">#{order.id}</td>
                                                <td className="py-3 px-4 font-body">{order.customer}</td>
                                                <td className="py-3 px-4 font-heading font-bold">{order.qty}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase ${order.status === 'quoted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>{order.status}</span>
                                                </td>
                                                <td className="py-3 px-4 font-body text-grey-500">{order.date}</td>
                                                <td className="py-3 px-4">
                                                    <button className="p-1.5 hover:bg-grey-200 rounded-lg transition-colors cursor-pointer"><Eye size={14} className="text-grey-500" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    );
}
