
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="relative bg-white/70 backdrop-blur-3xl text-secondary-600 py-16 border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-50"></div>
            <div className="absolute -left-40 bottom-0 w-96 h-96 bg-primary-200/30 rounded-full blur-[100px] z-0 pointer-events-none"></div>
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Brand */}
                <div className="space-y-6">
                    <Link href="/">
                        <img src="/logo.png" alt="Discountz Factory" className="h-12 w-auto" />
                    </Link>
                    <p className="text-sm text-secondary-500 leading-relaxed max-w-xs">
                        {settings.siteDescription}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-secondary-900 font-black mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><Link href="/stores" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> Browse Stores</Link></li>
                        <li><Link href="/categories" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> Categories</Link></li>
                        <li><Link href="/search" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-secondary-900 font-black mb-6 uppercase tracking-wider text-sm">Legal</h4>
                    <ul className="space-y-3 text-sm font-medium">
                        <li><Link href="/privacy" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> Terms of Service</Link></li>
                        <li><Link href="/contact" className="hover:text-primary-600 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-500 transition-colors"></span> Contact Us</Link></li>
                    </ul>
                </div>

                {/* Socials & Copyright */}
                <div>
                    <h4 className="text-secondary-900 font-black mb-6 uppercase tracking-wider text-sm">Follow Us</h4>
                    <div className="flex gap-4">
                        {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary-100 hover:bg-primary-600 hover:text-white p-2.5 rounded-full transition-all duration-300 text-secondary-600"><Facebook size={18} /></a>}
                        {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary-100 hover:bg-primary-600 hover:text-white p-2.5 rounded-full transition-all duration-300 text-secondary-600"><Twitter size={18} /></a>}
                        {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary-100 hover:bg-primary-600 hover:text-white p-2.5 rounded-full transition-all duration-300 text-secondary-600"><Instagram size={18} /></a>}
                        {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary-100 hover:bg-primary-600 hover:text-white p-2.5 rounded-full transition-all duration-300 text-secondary-600"><Youtube size={18} /></a>}
                        {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-secondary-100 hover:bg-primary-600 hover:text-white p-2.5 rounded-full transition-all duration-300 text-secondary-600"><Linkedin size={18} /></a>}
                    </div>
                    <p className="mt-8 text-sm text-secondary-400 font-medium">
                        &copy; {new Date().getFullYear()} Discountz Factory. <br />All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
