'use client';

import React, { useState } from 'react';
import { X, Phone, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { sendOTP, verifyOTP, createUser, findUserByPhone } from '@/lib/auth';
import Button from './Button';
import Input from './Input';

type Step = 'phone' | 'otp' | 'signup-info';

export default function AuthModal() {
    const { showAuthModal, closeAuthModal, login } = useAuthStore();
    const [step, setStep] = useState<Step>('phone');
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [devOtp, setDevOtp] = useState('');

    const resetForm = () => {
        setStep('phone');
        setMode('login');
        setPhone('');
        setOtp('');
        setName('');
        setEmail('');
        setError('');
        setDevOtp('');
    };

    const handleClose = () => {
        closeAuthModal();
        resetForm();
    };

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        setLoading(true);
        setError('');
        const result = await sendOTP(phone);
        setLoading(false);

        if (result.success) {
            // Extract dev OTP from message
            const otpMatch = result.message.match(/Dev: (\d+)/);
            if (otpMatch) setDevOtp(otpMatch[1]);

            const existingUser = findUserByPhone(phone);
            if (existingUser) {
                setMode('login');
            } else {
                setMode('signup');
            }
            setStep('otp');
        } else {
            setError(result.message);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');
        const result = await verifyOTP(phone, otp);
        setLoading(false);

        if (result.success) {
            if (mode === 'login') {
                const existingUser = findUserByPhone(phone);
                if (existingUser) {
                    login(existingUser);
                    handleClose();
                } else {
                    setStep('signup-info');
                }
            } else {
                setStep('signup-info');
            }
        } else {
            setError(result.message);
        }
    };

    const handleSignup = () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email');
            return;
        }

        const user = createUser({ name: name.trim(), email: email.trim(), phone });
        login(user);
        handleClose();
    };

    if (!showAuthModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 glass-overlay animate-fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-offwhite/95 backdrop-blur-xl rounded-2xl shadow-2xl animate-scale-in overflow-hidden border border-white/20">
                {/* Header */}
                <div className="relative bg-black px-8 py-10 text-center">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-grey-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="font-heading text-2xl font-bold uppercase tracking-widest text-white mb-2">
                        {step === 'signup-info' ? 'Almost There' : 'Welcome'}
                    </h2>
                    <p className="text-grey-400 text-sm font-body">
                        {step === 'phone' && 'Enter your phone number to continue'}
                        {step === 'otp' && `We sent a code to +91 ${phone}`}
                        {step === 'signup-info' && 'Tell us a bit about yourself'}
                    </p>
                </div>

                {/* Body */}
                <div className="p-8 sm:p-10">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50/50 border border-red-200 rounded-xl text-sm text-red-600 font-body flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {error}
                        </div>
                    )}

                    {/* Phone Step */}
                    {step === 'phone' && (
                        <div className="space-y-4">
                            <Input
                                label="Phone Number"
                                type="tel"
                                placeholder="Enter 10-digit number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                icon={<Phone size={16} />}
                                maxLength={10}
                            />
                            <Button
                                variant="accent"
                                fullWidth
                                size="lg"
                                onClick={handleSendOTP}
                                loading={loading}
                            >
                                Send OTP <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* OTP Step */}
                    {step === 'otp' && (
                        <div className="space-y-4">
                            <Input
                                label="Enter OTP"
                                type="text"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                            {devOtp && (
                                <p className="text-xs text-grey-400 font-body text-center">
                                    Dev OTP: <span className="font-bold text-terracotta">{devOtp}</span>
                                </p>
                            )}
                            <Button
                                variant="accent"
                                fullWidth
                                size="lg"
                                onClick={handleVerifyOTP}
                                loading={loading}
                            >
                                Verify <Check size={16} className="ml-2" />
                            </Button>
                            <button
                                onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                                className="w-full text-center text-sm text-grey-500 hover:text-black font-body transition-colors cursor-pointer"
                            >
                                Change phone number
                            </button>
                        </div>
                    )}

                    {/* Signup Info Step */}
                    {step === 'signup-info' && (
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                variant="accent"
                                fullWidth
                                size="lg"
                                onClick={handleSignup}
                            >
                                Create Account <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
