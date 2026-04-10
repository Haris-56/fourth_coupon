
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="relative bg-[#fafafa] text-secondary-900 border-t-8 border-secondary-900 pt-16 pb-8 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
                {/* Brand */}
                <div className="space-y-6 bg-white border-4 border-secondary-900 p-6 shadow-[8px_8px_0_0_#111827]">
                    <Link href="/">
                        <img src="/logo.png" alt="Saving Dealz Hub" className="h-12 w-auto" />
                    </Link>
                    <p className="text-sm text-secondary-900 font-bold border-l-4 border-primary-500 pl-3">
                        {settings.siteDescription}
                    </p>
                </div>

                {/* Quick Links */}
                <div className="bg-white border-4 border-secondary-900 p-6 shadow-[8px_8px_0_0_#111827]">
                    <h4 className="text-white bg-secondary-900 font-black px-3 py-1 mb-6 uppercase tracking-widest text-sm inline-block">Quick Links</h4>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest">
                        <li><Link href="/stores" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> BROWSE STORES</Link></li>
                        <li><Link href="/categories" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> CATEGORIES</Link></li>
                        <li><Link href="/search" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> NEW ARRIVALS</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="bg-white border-4 border-secondary-900 p-6 shadow-[8px_8px_0_0_#111827]">
                    <h4 className="text-white bg-secondary-900 font-black px-3 py-1 mb-6 uppercase tracking-widest text-sm inline-block">Legal</h4>
                    <ul className="space-y-4 text-sm font-black uppercase tracking-widest">
                        <li><Link href="/privacy" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> PRIVACY POLICY</Link></li>
                        <li><Link href="/terms" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> TERMS OF SERVICE</Link></li>
                        <li><Link href="/contact" className="hover:text-primary-600 transition-colors flex items-center gap-3 group"><span className="w-3 h-3 border-2 border-secondary-900 group-hover:bg-primary-500 transition-colors"></span> CONTACT US</Link></li>
                    </ul>
                </div>

                {/* Socials & Copyright */}
                <div className="bg-white border-4 border-secondary-900 p-6 shadow-[8px_8px_0_0_#111827]">
                    <h4 className="text-white bg-secondary-900 font-black px-3 py-1 mb-6 uppercase tracking-widest text-sm inline-block">Follow Us</h4>
                    <div className="flex flex-wrap gap-4">
                        {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-500 hover:text-secondary-900 p-3 transition-all duration-300 text-secondary-900 shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"><Facebook size={20} strokeWidth={2.5} /></a>}
                        {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-500 hover:text-secondary-900 p-3 transition-all duration-300 text-secondary-900 shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"><Twitter size={20} strokeWidth={2.5} /></a>}
                        {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-500 hover:text-secondary-900 p-3 transition-all duration-300 text-secondary-900 shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"><Instagram size={20} strokeWidth={2.5} /></a>}
                        {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-500 hover:text-secondary-900 p-3 transition-all duration-300 text-secondary-900 shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"><Youtube size={20} strokeWidth={2.5} /></a>}
                        {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-500 hover:text-secondary-900 p-3 transition-all duration-300 text-secondary-900 shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"><Linkedin size={20} strokeWidth={2.5} /></a>}
                    </div>
                    <p className="mt-8 text-sm text-secondary-600 font-bold border-l-4 border-secondary-900 pl-3">
                        &copy; {new Date().getFullYear()} Saving Dealz Hub. <br />All rights reserved.
                    </p>
                </div>
            </div>
            
            <div className="container mx-auto px-4 mt-8">
                <div className="w-full h-4 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#111827_10px,#111827_20px)] opacity-20"></div>
            </div>
        </footer>
    );
}
