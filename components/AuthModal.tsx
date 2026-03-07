'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Mail, ArrowRight, Loader2, Lock, Eye, EyeOff, User as UserIcon, Save, ShoppingBag, ChevronRight, ArrowLeft, Phone, MapPin, ShieldCheck } from 'lucide-react'; import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AuthModal() {
    const {
        showAuthModal,
        closeAuthModal,
        loginWithEmail,
        registerWithEmail,
        verifyEmailOTP,
        sendPasswordReset,
        updateFullProfile,
        fetchOrders,
        updatePassword,
        orders,
        user,
        isLoggedIn
    } = useAuthStore();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Address fields
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [showAddress, setShowAddress] = useState(false);

    // Password fields
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'register' | 'email-otp' | 'forgot-password' | 'reset-password' | 'edit-profile' | 'orders' | 'order-detail'>('login');
    const [otpCode, setOtpCode] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        if (!showAuthModal) {
            // Reset state on close
            setView('login');
            setEmail('');
            setName('');
            setPhoneNumber('');
            setAddressLine1('');
            setCity('');
            setState('');
            setPincode('');
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setShowAddress(false);
            setOtpCode('');
            setSelectedOrder(null);
        } else if (isLoggedIn && user) {
            // When opening while logged in, switch to edit-profile and fill data
            setView('edit-profile');
            setName(user.name || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phone?.replace('+91', '') || '');

            const addresses = user.addresses || [];
            const displayAddress =
                addresses.find(a => a.type === 'billing' && a.isDefault) ||
                addresses.find(a => a.type === 'billing') ||
                addresses.find(a => a.type === 'shipping' && a.isDefault) ||
                addresses[0];

            if (displayAddress) {
                setAddressLine1(displayAddress.addressLine1 || '');
                setCity(displayAddress.city || '');
                setState(displayAddress.state || '');
                setPincode(displayAddress.pincode || '');
            }

            fetchOrders();
        }
    }, [showAuthModal, isLoggedIn, user, fetchOrders]);

    // ── Login ──
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            await loginWithEmail(email, password);
            toast.success('Logged in successfully!');
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Register ──
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email || !password) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const addressData = showAddress && addressLine1 ? {
                fullName: name,
                phone: `+91${phoneNumber}`,
                addressLine1,
                city,
                state,
                pincode,
                type: 'billing' as const
            } : undefined;

            await registerWithEmail(name, email, phoneNumber, password, addressData);
            setView('email-otp');
            toast.success('OTP sent to your email!');
        } catch (error: any) {
            console.error('Register error:', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Verify Email OTP ──
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 8) {
            toast.error('Please enter an 8-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const addressData = showAddress && addressLine1 ? {
                fullName: name,
                phone: `+91${phoneNumber}`,
                addressLine1,
                city,
                state,
                pincode,
                type: 'billing' as const
            } : undefined;

            await verifyEmailOTP(email, otpCode, name, phoneNumber, addressData);
            toast.success('Account verified successfully! Welcome to BihariThread!');
        } catch (error: any) {
            console.error('OTP verification error:', error);
            toast.error(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Forgot Password ──
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordReset(email);
            toast.success('Password reset link sent to your email!');
        } catch (error: any) {
            console.error('Reset error:', error);
            toast.error(error.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    // ── Reset Password (callback from email link) ──
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(password);
            toast.success('Password updated successfully!');
            closeAuthModal();
        } catch (error: any) {
            console.error('Reset password error:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    // ── Update Profile ──
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        setLoading(true);
        try {
            await updateFullProfile(
                { name, email },
                {
                    fullName: name,
                    phone: `+91${phoneNumber}`,
                    addressLine1,
                    city,
                    state,
                    pincode,
                    type: 'billing'
                }
            );
            toast.success('Profile updated successfully!');
            closeAuthModal();
        } catch (error: any) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Dialog.Root open={showAuthModal} onOpenChange={(open) => !open && closeAuthModal()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[90vh] w-[95vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-background p-0 shadow-2xl focus:outline-none z-50 animate-content-show border border-border flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-muted/5">
                        <div className="flex justify-between items-center">
                            <div>
                                <Dialog.Title className="text-xl font-montserrat font-bold text-foreground">
                                    {view === 'login' && 'Welcome Back'}
                                    {view === 'register' && 'Create Account'}
                                    {view === 'email-otp' && 'Verify Email'}
                                    {view === 'forgot-password' && 'Reset Password'}
                                    {view === 'reset-password' && 'New Password'}
                                    {view === 'edit-profile' && 'My Profile'}
                                    {view === 'orders' && 'Order History'}
                                    {view === 'order-detail' && 'Order Details'}
                                </Dialog.Title>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {view === 'login' && 'Sign in to your account'}
                                    {view === 'register' && 'Join BihariThread today'}
                                    {view === 'email-otp' && `Code sent to ${email}`}
                                    {view === 'forgot-password' && 'We\'ll send a reset link to your email'}
                                    {view === 'reset-password' && 'Create a new strong password'}
                                    {view === 'edit-profile' && 'Manage your account and settings'}
                                    {view === 'orders' && 'List of your recent purchases'}
                                    {view === 'order-detail' && `Order ID: ${selectedOrder?.id?.slice(0, 8)}...`}
                                </p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-muted-foreground hover:bg-muted p-2 rounded-xl transition-colors" aria-label="Close">
                                    <X size={18} />
                                </button>
                            </Dialog.Close>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-y-auto p-6">

                        {/* ═══════════ LOGIN VIEW ═══════════ */}
                        {view === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => { setView('forgot-password'); setPassword(''); }}
                                            className="text-xs text-primary hover:underline font-bold"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email || !password}
                                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                                </button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setView('register'); setPassword(''); setConfirmPassword(''); }}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Register
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* ═══════════ REGISTER VIEW ═══════════ */}
                        {view === 'register' && (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Full Name *</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Phone Number</label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 flex items-center gap-1.5 text-muted-foreground border-r border-border pr-3">
                                            <Phone size={16} />
                                            <span className="text-sm font-bold text-foreground">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            autoComplete="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="10 digit number"
                                            className="w-full pl-24 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium tracking-wider"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Password *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="new-password"
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="6+ chars"
                                                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Confirm *</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Repeat"
                                                className="w-full px-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                    >
                                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                                        {showPassword ? 'Hide' : 'Show'} password
                                    </button>
                                </div>

                                {/* Optional Address */}
                                <div className="border-t border-border pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddress(!showAddress)}
                                        className="flex items-center gap-2 text-xs text-primary font-bold hover:underline"
                                    >
                                        <MapPin size={14} />
                                        {showAddress ? 'Hide' : 'Add'} Delivery Address (Optional)
                                    </button>

                                    {showAddress && (
                                        <div className="mt-3 space-y-3">
                                            <input
                                                type="text"
                                                value={addressLine1}
                                                onChange={(e) => setAddressLine1(e.target.value)}
                                                placeholder="Flat, House no, Building, Street"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="City"
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                />
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    placeholder="State"
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                placeholder="Pincode"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !name.trim() || !email || password.length < 6 || password !== confirmPassword}
                                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            Create Account
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setView('login'); setPassword(''); setConfirmPassword(''); }}
                                        className="text-primary font-bold hover:underline"
                                    >
                                        Login
                                    </button>
                                </p>
                            </form>
                        )}

                        {/* ═══════════ EMAIL OTP VIEW ═══════════ */}
                        {view === 'email-otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-wider text-center block">Enter 8-digit OTP</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                            placeholder="00000000"
                                            className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold tracking-[0.4em] text-center text-lg"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading || otpCode.length !== 8}
                                        className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Account'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('register')}
                                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors text-center py-2"
                                    >
                                        Wrong email? Go back
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ═══════════ FORGOT PASSWORD VIEW ═══════════ */}
                        {view === 'forgot-password' && (
                            <form onSubmit={handleForgotPassword} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                                >
                                    <ArrowLeft size={14} /> Back to Login
                                </button>
                            </form>
                        )}

                        {/* ═══════════ RESET PASSWORD VIEW ═══════════ */}
                        {view === 'reset-password' && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="6+ characters"
                                                className="w-full pl-12 pr-12 py-3.5 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                required
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm password"
                                                className="w-full pl-12 pr-12 py-3.5 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || password.length < 6 || password !== confirmPassword}
                                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Password'}
                                </button>
                            </form>
                        )}

                        {/* ═══════════ EDIT PROFILE VIEW ═══════════ */}
                        {view === 'edit-profile' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setView('orders')}
                                    className="w-full flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl hover:bg-muted/30 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <ShoppingBag size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">My Orders</p>
                                            <p className="text-[10px] text-muted-foreground">View order status & history</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </button>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Delivery Address</label>
                                            <input
                                                type="text"
                                                value={addressLine1}
                                                onChange={(e) => setAddressLine1(e.target.value)}
                                                placeholder="Flat, House no, Building, Street"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">City</label>
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="City"
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">State</label>
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    placeholder="State"
                                                    className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Pincode</label>
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                placeholder="6 digit PIN"
                                                className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !name.trim()}
                                        className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-lg shadow-primary/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ═══════════ ORDERS VIEW ═══════════ */}
                        {view === 'orders' && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setView('edit-profile')}
                                    className="flex items-center gap-2 text-primary text-xs font-bold hover:underline mb-2"
                                >
                                    <ArrowLeft size={14} /> Back to Profile
                                </button>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl">
                                        <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-foreground">No orders found</p>
                                        <p className="text-xs text-muted-foreground mt-1">Start shopping to see your history here!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setView('order-detail');
                                                }}
                                                className="p-4 bg-muted/20 border border-border rounded-xl hover:border-primary/30 transition-all cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Order Date</p>
                                                        <p className="text-sm font-bold">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg mt-2">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground">Amount Paid</p>
                                                        <p className="text-sm font-black">₹{order.total}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                                        Details <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ═══════════ ORDER DETAIL VIEW ═══════════ */}
                        {view === 'order-detail' && selectedOrder && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setView('orders')}
                                    className="flex items-center gap-2 text-primary text-xs font-bold hover:underline"
                                >
                                    <ArrowLeft size={14} /> Back to Orders
                                </button>

                                <div className="space-y-6">
                                    {/* Items List */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Items Purchased</p>
                                        {selectedOrder.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 p-3 bg-muted/20 border border-border rounded-xl">
                                                <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-border flex-shrink-0">
                                                    <Image
                                                        src={item.product?.image || '/placeholder.png'}
                                                        alt={item.product?.name || 'Product'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <p className="text-sm font-bold line-clamp-1">{item.product?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                                                    <p className="text-sm font-black mt-1">₹{item.product?.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Address & Payment Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-muted/20 border border-border rounded-xl">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Ship To</p>
                                            <p className="text-[11px] font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                                                {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-muted/20 border border-border rounded-xl">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Payment</p>
                                            <p className="text-[11px] font-bold">Razorpay ID:</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 truncate">
                                                {selectedOrder.razorpay_payment_id || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Total Bill */}
                                    <div className="p-4 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase opacity-80">Total Order Value</p>
                                                <p className="text-xs opacity-70">Tax included & Shipping Free</p>
                                            </div>
                                            <p className="text-2xl font-black">₹{selectedOrder.total}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Only for auth views */}
                    {(view === 'login' || view === 'register' || view === 'email-otp' || view === 'forgot-password') && (
                        <div className="p-6 border-t border-border text-center bg-muted/5">
                            <p className="text-[10px] text-muted-foreground">
                                By continuing, you agree to our <span className="text-foreground font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-foreground font-bold hover:underline cursor-pointer">Privacy Policy</span>.
                            </p>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >
    );
}
