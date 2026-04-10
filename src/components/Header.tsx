
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';
import SearchForm from '@/components/SearchForm';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b-8 border-secondary-900 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <img src="/logo.png" alt="Saving Dealz Hub" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block flex-1 max-w-xl mx-auto">
                    <SearchForm compact />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/" className="text-secondary-900 hover:bg-secondary-900 hover:text-white px-4 py-2 font-black text-sm uppercase tracking-widest transition-colors border-2 border-transparent hover:border-secondary-900">
                            Home
                        </Link>
                        <Link href="/categories" className="text-secondary-900 hover:bg-secondary-900 hover:text-white px-4 py-2 font-black text-sm uppercase tracking-widest transition-colors border-2 border-transparent hover:border-secondary-900">
                            Categories
                        </Link>
                        <Link href="/stores" className="text-secondary-900 hover:bg-secondary-900 hover:text-white px-4 py-2 font-black text-sm uppercase tracking-widest transition-colors border-2 border-transparent hover:border-secondary-900">
                            Stores
                        </Link>
                    </div>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-3 bg-[#fafafa] hover:bg-primary-500 px-4 py-2 rounded-none transition-all border-4 border-secondary-900 group shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                            <div className="w-8 h-8 rounded-none bg-white border-2 border-secondary-900 flex items-center justify-center text-secondary-900 group-hover:bg-secondary-900 group-hover:text-white transition-colors">
                                <User size={18} strokeWidth={3} />
                            </div>
                            <span className="hidden lg:block text-sm font-black uppercase tracking-widest text-secondary-900">My Account</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/login" className="text-secondary-900 hover:bg-secondary-900 hover:text-white px-4 py-2 font-black text-sm uppercase tracking-widest transition-colors border-[3px] border-secondary-900 bg-[#fafafa]">
                                Login
                            </Link>
                            <Link href="/signup" className="block bg-primary-500 hover:bg-secondary-900 text-secondary-900 hover:text-white px-6 py-2 border-[3px] border-secondary-900 text-sm font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                Sign Up Free
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <MobileMenu isAuth={session.isAuth} role={session.role} />
                    </div>
                </nav>
            </div>
        </header>
    );
}
