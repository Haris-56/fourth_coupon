
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight, User, Facebook, Twitter, Youtube, Linkedin, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface MobileMenuProps {
    isAuth: boolean;
    role?: string | null;
}

export function MobileMenu({ isAuth, role }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.width = 'auto';
        };
    }, [isOpen]);

    const sidebarContent = (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9998] transition-opacity backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel - Portal ensures this is top-level */}
            <div
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-[300px] bg-[#fafafa] border-r-4 border-secondary-900 z-[9999] shadow-[12px_0_0_0_#111827] transform transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                {/* Header / Logo Section */}
                <div className="p-6 flex flex-col items-center border-b-4 border-secondary-900 relative bg-primary-400">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white text-secondary-900 border-2 border-secondary-900 hover:bg-secondary-900 hover:text-white transition-colors"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>

                    {/* Logo */}
                    <Link href="/" onClick={() => setIsOpen(false)} className="mb-6 mt-6 p-2 bg-white border-4 border-secondary-900 shadow-[4px_4px_0_0_#111827]">
                        <img src="/logo.png" alt="Saving Dealz Hub" className="h-10 w-auto filter grayscale" />
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="p-6 border-b-4 border-secondary-900 bg-white">
                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary-900 flex items-center justify-center text-white border-2 border-secondary-900">
                                <User size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-secondary-900 truncate uppercase tracking-widest text-sm">Admin</p>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-secondary-900 font-bold hover:text-primary-600 transition-colors flex items-center gap-1 uppercase"
                                >
                                    View Profile <ChevronRight size={14} strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3 px-4 bg-[#fafafa] border-[3px] border-secondary-900 text-secondary-900 font-black uppercase tracking-widest text-sm text-center hover:bg-secondary-900 hover:text-white transition-colors shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                Log In
                            </Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 px-4 bg-primary-500 border-[3px] border-secondary-900 text-secondary-900 font-black uppercase tracking-widest text-sm text-center hover:bg-secondary-900 hover:text-white transition-colors shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-4 bg-[#fafafa]">
                    {[
                        { label: 'Search', href: '/search' },
                        { label: 'Categories', href: '/categories' },
                        { label: 'Stores', href: '/stores' },
                        { label: 'Home', href: '/' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 border-[3px] border-secondary-900 font-black uppercase tracking-widest text-sm transition-all group",
                                pathname === item.href ? "bg-secondary-900 text-white shadow-[4px_4px_0_0_#9333EA] -translate-y-1 translate-x-1" : "bg-white text-secondary-900 hover:bg-primary-500 shadow-[4px_4px_0_0_#111827] hover:-translate-y-1 hover:translate-x-1"
                            )}
                        >
                            <span className={cn(
                                "w-2 h-2 border-2 border-secondary-900 group-hover:bg-primary-900 transition-colors",
                                pathname === item.href ? "bg-white" : "bg-transparent"
                            )}></span>

                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {isAuth && (
                        <button
                            onClick={async () => {
                                await logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500 border-[3px] border-secondary-900 font-black uppercase tracking-widest text-sm text-white hover:bg-secondary-900 transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none mt-8"
                        >
                            <LogOut size={20} strokeWidth={3} />
                            <span>Log Out</span>
                        </button>
                    )}
                </nav>

                {/* Footer / Socials */}
                <div className="p-6 border-t-4 border-secondary-900 bg-white mt-auto">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { Icon: Facebook, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Youtube, href: '#' },
                            { Icon: Linkedin, href: '#' },
                        ].map(({ Icon, href }, idx) => (
                            <Link
                                key={idx}
                                href={href}
                                className="w-12 h-12 bg-[#fafafa] border-[3px] border-secondary-900 flex items-center justify-center text-secondary-900 hover:bg-primary-500 hover:text-secondary-900 transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <Icon size={20} strokeWidth={2.5} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    if (!mounted) {
        return (
            <button
                className="md:hidden p-3 bg-white border-[3px] border-secondary-900 text-secondary-900 transition-all shadow-[4px_4px_0_0_#111827]"
                aria-label="Open Menu Placeholder"
            >
                <Menu size={24} strokeWidth={3} />
            </button>
        );
    }

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-white border-[3px] border-secondary-900 text-secondary-900 hover:bg-primary-500 transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"
                aria-label="Open Menu"
            >
                <Menu size={24} strokeWidth={3} />
            </button>
            {createPortal(sidebarContent, document.body)}
        </div>
    );
}
