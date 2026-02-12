import { User } from '@/types';

// Simulated OTP storage
let currentOTP: string | null = null;

export async function sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    // Generate a random 6-digit OTP
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // In production, this would send via SMS
    console.log(`[DEV] OTP for ${phone}: ${currentOTP}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
        success: true,
        message: `OTP sent to ${phone}. (Dev: ${currentOTP})`,
    };
}

export async function verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Accept any 6-digit OTP in dev mode, or match the generated one
    if (otp.length === 6 || otp === currentOTP) {
        currentOTP = null;
        return { success: true, message: 'OTP verified successfully' };
    }

    return { success: false, message: 'Invalid OTP. Please try again.' };
}

export function createUser(data: {
    name: string;
    email: string;
    phone: string;
}): User {
    return {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        addresses: [],
    };
}

export function findUserByPhone(phone: string): User | null {
    // In production, this would query a database
    // For MVP, we check localStorage
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('biharithread-auth');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed?.state?.user?.phone === phone) {
                    return parsed.state.user;
                }
            } catch {
                return null;
            }
        }
    }
    return null;
}
