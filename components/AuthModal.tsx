'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AuthModal() {
    const { showAuthModal, closeAuthModal, login } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm();
    const { register: registerRegister, handleSubmit: handleSubmitRegister } = useForm();

    const onLoginSubmit = (data: any) => {
        // Mock login
        console.log('Login Data:', data);
        login({
            id: 'mock-user-1',
            name: 'Demo User',
            email: data.email,
            phone: '9876543210',
            addresses: []
        });
        toast.success('Logged in successfully!');
        closeAuthModal();
    };

    const onRegisterSubmit = (data: any) => {
        // Mock register
        console.log('Register Data:', data);
        login({
            id: 'mock-user-new',
            name: data.name,
            email: data.email,
            phone: data.phone,
            addresses: [] // Address is optional/empty initially
        });
        toast.success('Registered successfully!');
        closeAuthModal();
    };

    return (
        <Dialog.Root open={showAuthModal} onOpenChange={(open) => !open && closeAuthModal()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[425px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-background p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50 animate-content-show">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-montserrat font-bold m-0 text-foreground">
                            {activeTab === 'login' ? 'Welcome Back' : 'Join BihariThread'}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-foreground hover:bg-muted p-1 rounded-full" aria-label="Close">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="flex gap-4 mb-6 border-b border-border">
                        <button
                            className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'login' ? 'text-accent' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                            {activeTab === 'login' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                            )}
                        </button>
                        <button
                            className={`pb-2 text-sm font-medium transition-colors relative ${activeTab === 'register' ? 'text-accent' : 'text-muted-foreground'}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                            {activeTab === 'register' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'login' ? (
                        <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                <input
                                    {...registerLogin('email', { required: true })}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                <input
                                    {...registerLogin('password', { required: true })}
                                    type="password"
                                    placeholder="Enter your password"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                            >
                                Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmitRegister(onRegisterSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                                <input
                                    {...registerRegister('name', { required: true })}
                                    placeholder="Your Name"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                                <input
                                    {...registerRegister('email', { required: true })}
                                    type="email"
                                    placeholder="Your Email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone</label>
                                <input
                                    {...registerRegister('phone', { required: true })}
                                    type="tel"
                                    placeholder="Your Phone Number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Address (Optional)</label>
                                <textarea
                                    {...registerRegister('address')}
                                    placeholder="You can add this later too"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                            >
                                Register
                            </button>
                        </form>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// Add these keyframes to your globals.css if not present, or use Tailwind animations
// animate-content-show and animate-fade-in
