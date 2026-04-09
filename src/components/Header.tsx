
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';
import SearchForm from '@/components/SearchForm';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="sticky top-0 z-40 w-full glass border-b-white/50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <img src="/logo.png" alt="Discountz Factory" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block flex-1 max-w-xl mx-auto">
                    <SearchForm compact />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-secondary-600 hover:text-primary-600 font-bold text-sm transition-colors relative group">
                            Home
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </Link>
                        <Link href="/categories" className="text-secondary-600 hover:text-primary-600 font-bold text-sm transition-colors relative group">
                            Categories
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </Link>
                        <Link href="/stores" className="text-secondary-600 hover:text-primary-600 font-bold text-sm transition-colors relative group">
                            Stores
                            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                        </Link>
                    </div>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-3 bg-secondary-50 hover:bg-primary-50 px-4 py-2 rounded-full transition-all border border-secondary-100 hover:border-primary-200 group">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <span className="hidden lg:block text-sm font-bold text-secondary-800 group-hover:text-primary-700">My Account</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/login" className="text-secondary-700 hover:text-primary-600 font-bold text-sm transition-colors px-2">
                                Login
                            </Link>
                            <div className="glow-effect">
                                <Link href="/signup" className="block bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5">
                                    Sign Up Free
                                </Link>
                            </div>
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
