'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Phone, ShieldCheck, ArrowRight, Loader2, Lock, Eye, EyeOff, Key, User as UserIcon, Save, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AuthModal() {
    const {
        showAuthModal,
        closeAuthModal,
        sendOTP,
        verifyOTP,
        completeProfile,
        checkUser,
        loginWithPassword,
        updateFullProfile,
        fetchOrders,
        updatePassword,
        orders,
        user,
        isLoggedIn
    } = useAuthStore();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Address fields
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    // Password fields
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'phone' | 'otp' | 'profile' | 'password-login' | 'reset-password' | 'edit-profile' | 'orders' | 'order-detail'>('phone');
    const [isResetFlow, setIsResetFlow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    useEffect(() => {
        if (!showAuthModal) {
            // Reset state on close
            setView('phone');
            setPhoneNumber('');
            setOtpCode('');
            setName('');
            setEmail('');
            setAddressLine1('');
            setCity('');
            setState('');
            setPincode('');
            setPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setIsResetFlow(false);
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

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const { exists, hasName, hasPassword } = await checkUser(phoneNumber);
            if (exists && hasName && hasPassword) {
                setView('password-login');
            } else {
                await sendOTP(phoneNumber);
                setView('otp');
                toast.success('OTP sent successfully!');
            }
        } catch (error: any) {
            console.error('Error in handleContinue:', error);
            // Fallback to OTP if check fails
            try {
                await sendOTP(phoneNumber);
                setView('otp');
                toast.success('OTP sent successfully!');
            } catch (otpErr: any) {
                toast.error(otpErr.message || 'Failed to proceed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        setLoading(true);
        try {
            await loginWithPassword(phoneNumber, password);
            toast.success('Logged in successfully!');
            closeAuthModal();
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginWithOTPInstead = async () => {
        setLoading(true);
        try {
            await sendOTP(phoneNumber);
            setView('otp');
            toast.success('OTP sent successfully!');
        } catch (error: any) {
            console.error('OTP error:', error);
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const { isNewUser } = await verifyOTP(phoneNumber, otpCode);
            if (isResetFlow) {
                if (isNewUser) {
                    setView('profile');
                    toast.info('Account not completed. Please setup your profile.');
                } else {
                    setView('reset-password');
                }
            } else if (isNewUser) {
                setView('profile');
                toast.info('Welcome! Please complete your profile.');
            } else {
                toast.success('Logged in successfully!');
                closeAuthModal();
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error);
            toast.error(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            await sendOTP(phoneNumber);
            setIsResetFlow(true);
            setView('otp');
            setOtpCode('');
            toast.success('OTP sent for password reset!');
        } catch (error: any) {
            console.error('Error sending reset OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleProfileSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (password) {
            if (password.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
        }

        setLoading(true);
        try {
            await completeProfile(
                { name, email, password },
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
            toast.success('Welcome to BihariThread!');
            closeAuthModal();
        } catch (error: any) {
            console.error('Profile setup error:', error);
            toast.error(error.message || 'Failed to complete profile setup');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            toast.error('Please fill in all required fields');
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
                                    {view === 'phone' && 'Welcome to Bihari Thread'}
                                    {view === 'password-login' && 'Welcome back'}
                                    {view === 'reset-password' && 'Reset Password'}
                                    {view === 'otp' && 'Verify OTP'}
                                    {view === 'profile' && 'Complete Profile'}
                                    {view === 'edit-profile' && 'My Profile'}
                                    {view === 'orders' && 'Order History'}
                                    {view === 'order-detail' && 'Order Details'}
                                </Dialog.Title>
                                <p className="text-muted-foreground text-xs mt-1">
                                    {view === 'phone' && 'Enter your phone to continue'}
                                    {view === 'password-login' && `Enter password for ${phoneNumber}`}
                                    {view === 'reset-password' && 'Create a new strong password'}
                                    {view === 'otp' && `Code sent to ${phoneNumber}`}
                                    {view === 'profile' && 'Almost there! Just a few more details'}
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
                        {view === 'phone' && (
                            <form onSubmit={handleContinue} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">Phone Number</label>
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
                                            placeholder="Enter 10 digit number"
                                            className="w-full pl-24 pr-4 py-3.5 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium tracking-wider"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || phoneNumber.length < 10}
                                    className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg shadow-primary/10"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            Get Started
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {view === 'password-login' && (
                            <form onSubmit={handlePasswordLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">Password</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={phoneNumber}
                                        readOnly
                                        style={{ display: 'none' }}
                                        autoComplete="username"
                                    />
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
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-xs text-primary hover:underline font-bold"
                                        >
                                            Reset Password?
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !password}
                                        className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLoginWithOTPInstead}
                                        disabled={loading}
                                        className="text-sm text-primary hover:bg-primary/5 py-2.5 rounded-lg border border-primary/20 font-bold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Key size={16} /> Login with OTP instead
                                    </button>
                                </div>
                            </form>
                        )}

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

                        {view === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-foreground uppercase tracking-wider text-center block">Enter 6-digit OTP</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000 000"
                                            className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold tracking-[0.4em] text-center text-lg"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading || otpCode.length !== 6}
                                        className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Code'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setView('phone')}
                                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors text-center py-2"
                                    >
                                        Entered wrong number? Change it
                                    </button>
                                </div>
                            </form>
                        )}

                        {(view === 'profile' || view === 'edit-profile') && (
                            <div className="space-y-6">
                                {view === 'edit-profile' && (
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
                                )}

                                <form onSubmit={view === 'profile' ? handleProfileSetup : handleUpdateProfile} className="space-y-4">
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
                                                required
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
                                                    required
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
                                                    required
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
                                                required
                                            />
                                        </div>

                                        {view === 'profile' && (
                                            <div className="pt-4 border-t border-border mt-2 space-y-4">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-tighter">Set Password (Fast Login)</p>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="6+ characters"
                                                            className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                        >
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Confirm Password</label>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="Repeat password"
                                                        className="w-full px-4 py-3 bg-muted/20 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !name.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()}
                                        className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-lg shadow-primary/10"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                <Save size={18} />
                                                {view === 'profile' ? 'Complete Account Setup' : 'Save Changes'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

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
                    {(view === 'phone' || view === 'password-login' || view === 'otp') && (
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
