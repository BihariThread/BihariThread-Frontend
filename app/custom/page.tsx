'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, ArrowRight, Check, ImageIcon } from 'lucide-react';
import LayoutWrapper from '@/components/LayoutWrapper';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function CustomPrintPage() {
    const [designPreview, setDesignPreview] = useState<string | null>(null);
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setDesignPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!size) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <LayoutWrapper>
                <div className="pt-28 pb-16 min-h-screen flex flex-col items-center justify-center px-4 page-enter">
                    <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                        <Check size={36} className="text-terracotta" />
                    </div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-black text-center">
                        Quote Requested!
                    </h1>
                    <p className="font-body text-grey-500 mt-3 text-center max-w-md">
                        We&apos;ve received your custom print request. Our team will get back to you within 24 hours with a quote.
                    </p>
                    <p className="font-heading text-sm font-bold text-terracotta mt-4">
                        Ref #{`CP${Date.now().toString().slice(-6)}`}
                    </p>
                    <Button variant="accent" className="mt-8" onClick={() => setSubmitted(false)}>
                        Submit Another Request
                    </Button>
                </div>
            </LayoutWrapper>
        );
    }

    return (
        <LayoutWrapper>
            <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto page-enter">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-terracotta font-heading text-xs font-bold uppercase tracking-[0.2em] mb-3">Custom Studio</p>
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-black">
                        Your Design,<br />Our Craft
                    </h1>
                    <p className="font-body text-grey-500 mt-4 max-w-lg mx-auto">
                        Upload your artwork, select your preferences, and we&apos;ll print it on premium 240 GSM cotton.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left — Upload & Preview */}
                        <div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden ${designPreview
                                        ? 'border-terracotta bg-white'
                                        : 'border-grey-300 bg-white hover:border-terracotta hover:bg-terracotta/5'
                                    }`}
                            >
                                {designPreview ? (
                                    <Image
                                        src={designPreview}
                                        alt="Your design"
                                        fill
                                        className="object-contain p-4"
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 bg-grey-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Upload size={28} className="text-grey-400" />
                                        </div>
                                        <p className="font-heading text-sm font-bold uppercase tracking-wider text-grey-600">Upload Your Design</p>
                                        <p className="font-body text-xs text-grey-400 mt-2">
                                            PNG, JPG, SVG — Max 10MB
                                        </p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                            {designPreview && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-3 font-heading text-xs font-bold uppercase tracking-widest text-terracotta hover:text-deep-maroon transition-colors cursor-pointer flex items-center gap-2"
                                >
                                    <ImageIcon size={14} /> Change Design
                                </button>
                            )}
                        </div>

                        {/* Right — Form */}
                        <div className="space-y-6">
                            {/* Size */}
                            <div>
                                <p className="font-heading text-xs font-bold uppercase tracking-widest text-grey-600 mb-3">
                                    Size <span className="text-terracotta">*</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSize(s)}
                                            className={`w-14 h-14 rounded-xl font-heading text-sm font-bold uppercase transition-all duration-200 cursor-pointer ${size === s
                                                    ? 'bg-black text-white shadow-lg scale-105'
                                                    : 'bg-white border-2 border-grey-200 text-black hover:border-black'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <Input
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                max="100"
                            />

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-heading font-semibold tracking-wider uppercase text-grey-600 mb-1.5">
                                    Notes / Instructions
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any specific instructions for printing..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border-2 border-grey-200 rounded-xl font-body text-black placeholder:text-grey-400 focus:border-terracotta focus:outline-none transition-colors duration-200 resize-none"
                                />
                            </div>

                            {/* Price Info */}
                            <div className="bg-white rounded-xl p-4 border border-grey-200">
                                <p className="font-heading text-xs font-bold uppercase tracking-widest text-grey-600 mb-2">Pricing</p>
                                <p className="font-body text-sm text-grey-500">
                                    Custom prints start from <span className="font-bold text-black">₹799</span> per piece.
                                    Final price depends on design complexity and quantity.
                                </p>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                variant="accent"
                                size="lg"
                                fullWidth
                                disabled={!size}
                            >
                                Request Quote <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </LayoutWrapper>
    );
}
