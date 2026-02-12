'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModal';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <AuthModal />
        </>
    );
}
