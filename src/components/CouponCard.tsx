
'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, X, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { voteCoupon } from '@/actions/coupon';
import Link from 'next/link';

interface CouponCardProps {
    coupon: any;
    layout?: 'vertical' | 'horizontal';
}

export function CouponCard({ coupon, layout = 'vertical' }: CouponCardProps) {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const handleCopy = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();

        // Open the tracking link in a new tab
        const link = coupon.trackingLink || coupon.store?.affiliateLink || '#';
        if (link !== '#') {
            window.open(link, '_blank');
        }

        // Show modal for all types
        setShowModal(true);
    };

    const handleVote = async (isUp: boolean) => {
        if (hasVoted) return;
        setHasVoted(true);
        await voteCoupon(coupon._id, isUp);
    };

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowModal(false);
    };

    // Modal Component
    const Modal = () => {
        if (!showModal) return null;

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-secondary-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={closeModal}>
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200 border border-primary-100/50" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="bg-gradient-to-b from-primary-50 to-white p-8 flex flex-col items-center text-center border-b border-primary-100/50 relative">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-secondary-400 hover:text-secondary-600 p-1 rounded-full hover:bg-white/50 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-secondary-100 flex items-center justify-center mb-4 p-2">
                            {coupon.store?.logoUrl ? (
                                <img src={coupon.store.logoUrl} alt={coupon.store?.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="font-bold text-secondary-400 text-xl">{coupon.store?.name?.substring(0, 1)}</span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-secondary-800 break-words w-full px-4">{coupon.title}</h3>
                        <p className="text-secondary-500 text-sm mt-1">at {coupon.store?.name}</p>
                    </div>

                    {/* Body */}
                    <div className="p-8 flex flex-col items-center gap-6">
                        {coupon.couponType === 'Code' ? (
                            <div className="text-center space-y-2 w-full text-center">
                                <p className="text-sm font-semibold text-secondary-500 uppercase tracking-wide">Copy and paste this code at {coupon.store?.name}</p>
                                <div className="relative group cursor-pointer" onClick={handleCopy}>
                                    <div className="bg-secondary-50 border-2 border-dashed border-secondary-300 rounded-xl px-8 py-4 flex items-center gap-4 min-w-[240px] justify-center hover:border-primary-400 hover:bg-primary-50/10 transition-all">
                                        <span className="text-2xl font-mono font-bold text-primary-600 tracking-wider select-all">{coupon.code}</span>
                                        <button className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold ml-2">Copy</button>
                                    </div>
                                    {copied && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-600 font-bold animate-in fade-in slide-in-from-bottom-1">Copied!</span>}
                                </div>
                                <div className="pt-4">
                                    <a
                                        href={coupon.trackingLink || coupon.store?.affiliateLink || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95 text-center"
                                    >
                                        Go to {coupon.store?.name}
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 w-full text-center">
                                <p className="text-secondary-600 font-medium px-4">No code required! The discount will be automatically applied when you click the button below.</p>
                                <a
                                    href={coupon.trackingLink || coupon.store?.affiliateLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95 text-center"
                                >
                                    Go to Deal
                                </a>
                            </div>
                        )}

                        {/* Did it work? */}
                        <div className="flex flex-col items-center gap-3 pt-4 border-t border-secondary-100 w-full">
                            <p className="text-sm font-medium text-secondary-500">
                                {hasVoted ? 'Thanks for your feedback!' : 'Did it work?'}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    disabled={hasVoted}
                                    onClick={() => handleVote(false)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all group",
                                        hasVoted ? "opacity-50 cursor-default border-secondary-200" : "border-secondary-200 hover:bg-red-50 hover:border-red-200"
                                    )}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">🙁</span>
                                    <span className="text-sm font-bold text-secondary-600 group-hover:text-red-600">{coupon.votesDown || 0}</span>
                                </button>
                                <button
                                    disabled={hasVoted}
                                    onClick={() => handleVote(true)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all group",
                                        hasVoted ? "opacity-50 cursor-default border-secondary-200" : "border-secondary-200 hover:bg-green-50 hover:border-green-200"
                                    )}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">😊</span>
                                    <span className="text-sm font-bold text-secondary-600 group-hover:text-green-600">{coupon.votesUp || 0}</span>
                                </button>
                            </div>
                        </div>

                        <button onClick={closeModal} className="text-sm text-secondary-400 hover:text-secondary-600 hover:underline">
                            Close and continue to {coupon.store?.name}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (layout === 'horizontal') {
        return (
            <>
                <Modal />
                <div className="bg-white rounded-none border-2 border-secondary-900 border-b-8 border-r-8 overflow-hidden hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#9333EA] transition-all duration-300 group flex flex-col md:flex-row items-center p-6 md:p-8 gap-6 md:gap-8 relative h-full">
                    {/* Logo Section */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-[#fafafa] rounded-none flex items-center justify-center p-4 border-2 border-secondary-900 group-hover:bg-primary-50 transition-colors">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all font-bold" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all font-bold" />
                        ) : (
                            <div className="text-3xl font-black text-secondary-900">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 w-full text-center md:text-left h-full flex flex-col justify-center border-t-2 md:border-t-0 md:border-l-2 border-dashed border-secondary-300 pt-6 md:pt-0 md:pl-8">
                        <div className="flex flex-wrap items-center gap-2 mb-3 justify-center md:justify-start">
                            {coupon.isVerified && <span className="text-[10px] font-black bg-green-400 text-secondary-900 border-2 border-secondary-900 px-3 py-1 rounded-none uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0_0_#111827]">VERIFIED</span>}
                            {coupon.isExclusive && <span className="text-[10px] font-black bg-primary-400 text-secondary-900 border-2 border-secondary-900 px-3 py-1 rounded-none uppercase tracking-widest shadow-[2px_2px_0_0_#111827]">EXCLUSIVE</span>}

                            <div className="flex items-center gap-3 bg-secondary-100 border-2 border-secondary-900 px-3 py-1 rounded-none ml-auto shadow-[2px_2px_0_0_#111827] hidden lg:flex">
                                <span className="text-[10px] font-black text-secondary-900 flex items-center gap-1">↑ {coupon.votesUp || 0}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-secondary-900 mb-2 leading-none uppercase tracking-tighter">{coupon.title}</h3>
                        <p className="text-secondary-600 text-sm font-bold line-clamp-2 md:line-clamp-1 border-l-4 border-primary-500 pl-3">{coupon.description || `Save at ${coupon.store?.name} today.`}</p>
                    </div>

                    {/* Action Section */}
                    <div className="flex-shrink-0 w-full md:w-auto self-center lg:pl-6">
                        {coupon.couponType === 'Code' ? (
                            <button
                                onClick={handleAction}
                                className="w-full md:w-auto flex flex-col items-center bg-white border-[3px] border-secondary-900 text-secondary-900 font-black px-10 py-3 rounded-none transition-all hover:bg-secondary-900 hover:text-white shadow-[4px_4px_0_0_#9333EA] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <span className="text-[10px] uppercase tracking-widest border-b-2 border-inherit mb-1">Coupon Code</span>
                                <span className="flex items-center gap-2 text-xl font-mono">
                                    <Scissors size={20} className="rotate-[-45deg]" />
                                    XXXXXX
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleAction}
                                className="w-full md:w-auto bg-primary-500 hover:bg-secondary-900 text-secondary-900 hover:text-white text-xl font-black px-10 py-5 rounded-none border-[3px] border-secondary-900 transition-all shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase"
                            >
                                Get Deal
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Vertical Layout (Default - Box Card)
    return (
        <>
            <Modal />
            <div className="bg-white rounded-none border-2 border-secondary-900 border-b-8 border-r-8 overflow-hidden hover:-translate-y-2 hover:translate-x-1 hover:shadow-[8px_8px_0_0_#9333EA] transition-all duration-300 group h-full flex flex-col relative w-full">
                {/* Layered Top Section */}
                <div className="h-24 bg-[#fafafa] border-b-4 border-dashed border-secondary-900 relative p-5 flex items-center justify-end">
                    {/* Badge at top right */}
                    <div className="flex gap-2 relative z-20">
                        {coupon.isVerified && <span className="bg-green-400 border-2 border-secondary-900 text-secondary-900 text-[10px] font-black px-3 py-1 rounded-none shadow-[2px_2px_0_0_#111827] uppercase tracking-widest">VERIFIED</span>}
                    </div>

                    {/* Overlapping Brutalist Logo Box */}
                    <div className="absolute -bottom-10 left-6 w-24 h-24 bg-white rounded-none flex items-center justify-center overflow-hidden border-2 border-secondary-900 shadow-[4px_4px_0_0_#111827] p-2 z-10 group-hover:-translate-y-2 transition-transform">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0" />
                        ) : (
                            <div className="text-3xl font-black text-secondary-900">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-12 flex-1 flex flex-col relative z-20 bg-white">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <Link href={`/store/${coupon.store?.slug}`} className="text-sm border-b-2 border-secondary-900 font-black tracking-widest uppercase hover:bg-primary-500 transition-colors">
                            {coupon.store?.name}
                        </Link>
                        <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-all font-mono font-bold">
                            <span className="text-xs">↑ {coupon.votesUp || 0}</span>
                        </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-secondary-900 leading-[1.0] mb-4 uppercase tracking-tighter line-clamp-3 min-h-[64px]">
                        {coupon.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-6 pointer-events-none">
                        {coupon.couponType === 'Code' ? (
                            <span className="text-[10px] font-black bg-secondary-900 text-white px-2 py-1 rounded-none border border-secondary-900 uppercase tracking-widest">CODE</span>
                        ) : (
                            <span className="text-[10px] font-black bg-white text-secondary-900 border-2 border-secondary-900 px-2 py-1 rounded-none uppercase tracking-widest">DEAL</span>
                        )}
                        {coupon.discountValue && (
                            <span className="text-[10px] font-black text-primary-700 bg-primary-100 px-2 py-1 rounded-none border-2 border-secondary-900 uppercase tracking-widest shadow-[2px_2px_0_0_#111827]">
                                {coupon.discountValue}
                            </span>
                        )}
                    </div>

                    <p className="text-secondary-600 text-sm font-bold mb-8 border-l-4 border-primary-500 pl-3">
                        {coupon.description || `Get the latest discounts and deals at ${coupon.store?.name}.`}
                    </p>

                    <div className="mt-auto pt-4 border-t-4 border-dashed border-secondary-300">
                        {coupon.couponType === 'Code' ? (
                            <button
                                onClick={handleAction}
                                className="w-full bg-white border-4 border-secondary-900 text-secondary-900 font-black py-4 rounded-none transition-all hover:bg-secondary-900 hover:text-white shadow-[4px_4px_0_0_#9333EA] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                            >
                                <span>Reveal Code</span>
                                <Scissors size={18} className="rotate-[-45deg]" />
                            </button>
                        ) : (
                            <button
                                onClick={handleAction}
                                className="w-full bg-primary-500 border-4 border-secondary-900 text-secondary-900 font-black py-4 rounded-none transition-all shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-secondary-900 hover:text-white flex items-center justify-center uppercase tracking-widest text-sm"
                            >
                                Open Deal
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
