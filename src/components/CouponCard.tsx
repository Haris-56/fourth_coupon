
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
                <div className="glass rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/15 hover:-translate-y-1 hover:border-primary-300/50 transition-all duration-500 group flex flex-col md:flex-row items-center p-6 gap-6 relative h-full">
                    {/* Logo Section */}
                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-2xl flex items-center justify-center p-4 border border-secondary-100 shadow-sm group-hover:shadow-md transition-shadow">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain filter group-hover:brightness-110 transition-all font-bold" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain filter group-hover:brightness-110 transition-all font-bold" />
                        ) : (
                            <div className="text-xl font-bold text-secondary-300">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 w-full text-center md:text-left h-full flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-2 justify-center md:justify-start">
                            {coupon.isVerified && <span className="text-[10px] font-black bg-green-500 text-white px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">Verified</span>}
                            {coupon.isExclusive && <span className="text-[10px] font-black bg-primary-600 text-white px-3 py-1 rounded-full uppercase tracking-tighter">Exclusive</span>}

                            <div className="flex items-center gap-3 bg-secondary-50 px-3 py-1 rounded-full">
                                <span className="text-[10px] font-bold text-secondary-600 flex items-center gap-1">😊 {coupon.votesUp || 0}</span>
                                <span className="text-[10px] font-bold text-secondary-600 flex items-center gap-1">🙁 {coupon.votesDown || 0}</span>
                            </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-secondary-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{coupon.title}</h3>
                        <p className="text-secondary-500 text-sm font-medium line-clamp-2 md:line-clamp-1">{coupon.description || `Save at ${coupon.store?.name} today.`}</p>
                    </div>

                    {/* Action Section */}
                    <div className="flex-shrink-0 w-full md:w-auto self-center lg:pl-4">
                        {coupon.couponType === 'Code' ? (
                            <button
                                onClick={handleAction}
                                className="w-full md:w-auto relative group flex flex-col items-center bg-white border-2 border-dashed border-primary-500 text-primary-600 font-black px-10 py-3 rounded-2xl transition-all hover:bg-primary-50 active:scale-95 shadow-sm"
                            >
                                <span className="text-[10px] uppercase tracking-widest text-primary-400 mb-0.5 font-bold">Coupon Code</span>
                                <span className="flex items-center gap-2 text-lg">
                                    <Scissors size={18} className="rotate-[-45deg]" />
                                    Show Code
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleAction}
                                className="w-full md:w-auto bg-primary-600 hover:bg-secondary-900 text-white text-lg font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-primary-500/10 hover-translate-y-0.5 active:scale-95"
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
            <div className="glass rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col relative shadow-xl shadow-primary-900/5 hover:shadow-2xl hover:shadow-primary-500/20">
                {/* Layered Top Section */}
                <div className="h-32 bg-gradient-to-br from-primary-100/50 via-purple-100/50 to-pink-50/50 relative p-5">
                    {/* Badge at top right */}
                    <div className="absolute top-5 right-5 flex gap-2">
                        {coupon.isVerified && <span className="bg-white/80 backdrop-blur-md text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">VERIFIED</span>}
                    </div>

                    {/* Overlapping Logo */}
                    <div className="absolute -bottom-8 left-6 w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg p-3 z-10 group-hover:scale-105 transition-transform">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain filter group-hover:brightness-110" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain filter group-hover:brightness-110" />
                        ) : (
                            <div className="text-xl font-black text-secondary-300 mix-blend-multiply">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-10 flex-1 flex flex-col relative z-20">
                    <div className="flex items-center justify-between mb-3">
                        <Link href={`/store/${coupon.store?.slug}`} className="text-sm text-primary-600 hover:text-secondary-900 font-black tracking-tight uppercase">
                            {coupon.store?.name}
                        </Link>
                        <div className="flex gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                            <span className="text-xs">😊 {coupon.votesUp || 0}</span>
                        </div>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-secondary-900 leading-[1.1] mb-4 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[52px]">
                        {coupon.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-6">
                        {coupon.couponType === 'Code' ? (
                            <span className="text-[10px] font-black bg-secondary-900 text-white px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-sm">Coupon Code</span>
                        ) : (
                            <span className="text-[10px] font-black bg-green-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-sm">Verified Deal</span>
                        )}
                        {coupon.discountValue && (
                            <span className="text-[10px] font-black text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 uppercase tracking-tighter">
                                {coupon.discountValue}
                            </span>
                        )}
                    </div>

                    <p className="text-secondary-500 text-sm font-medium mb-8 line-clamp-2 opacity-80 group-hover:opacity-100">
                        {coupon.description || `Get the latest discounts and deals at ${coupon.store?.name}.`}
                    </p>

                    <div className="mt-auto pt-2">
                        {coupon.couponType === 'Code' ? (
                            <button
                                onClick={handleAction}
                                className="w-full relative group bg-white/50 backdrop-blur-sm border-2 border-primary-200 text-primary-600 font-black py-4 rounded-2xl transition-all hover:bg-white hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>Reveal Code</span>
                                <Scissors size={18} className="rotate-[-45deg]" />
                            </button>
                        ) : (
                            <div className="glow-effect">
                                <button
                                    onClick={handleAction}
                                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-primary-500/20 active:scale-95 text-lg"
                                >
                                    Open Deal
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
