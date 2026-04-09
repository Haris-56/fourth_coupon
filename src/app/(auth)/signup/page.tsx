
'use client';

import { useActionState } from 'react';
import { signup } from '@/actions/auth';
import Link from 'next/link';

export default function SignupPage() {
    const [state, action, isPending] = useActionState(signup, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] relative overflow-hidden py-12">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[140px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-400/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
            <div className="glass p-10 rounded-[2.5rem] shadow-2xl shadow-primary-900/5 w-full max-w-md border-white relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-secondary-900 drop-shadow-sm mb-2">Create Account</h1>
                    <p className="text-secondary-500 font-medium">Join us to get exclusive coupons</p>
                </div>

                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-secondary-700 mb-2">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-5 py-3 border border-secondary-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 outline-none transition-all shadow-inner font-medium text-secondary-900"
                        />
                        {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary-700 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-5 py-3 border border-secondary-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 outline-none transition-all shadow-inner font-medium text-secondary-900"
                        />
                        {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary-700 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-5 py-3 border border-secondary-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 outline-none transition-all shadow-inner font-medium text-secondary-900"
                        />
                        <p className="text-xs text-secondary-400 font-medium mt-1">Must be at least 8 chars with 1 letter and 1 number.</p>
                        {state?.errors?.password && <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>}
                    </div>

                    {state?.message && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                            {state.message}
                        </div>
                    )}

                    <div className="glow-effect pt-2">
                        <button
                            disabled={isPending}
                            className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-secondary-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
