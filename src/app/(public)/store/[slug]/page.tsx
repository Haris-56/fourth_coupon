
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import { CouponCard } from '@/components/CouponCard';
import { notFound } from 'next/navigation';
import { ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStoreData(slug: string) {
    await connectToDatabase();
    const store = await StoreModel.findOne({ slug, isActive: true });

    if (!store) return null;

    const coupons = await Coupon.find({ store: store._id, isActive: true })
        .populate('store')
        .sort({ isFeatured: -1, createdAt: -1 });

    return {
        store: JSON.parse(JSON.stringify(store)),
        allCoupons: JSON.parse(JSON.stringify(coupons)),
    };
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await getStoreData(params.slug);
    if (!data) return { title: 'Store Not Found' };

    return {
        title: data.store.seoTitle || `${data.store.name} Coupons & Promo Codes`,
        description: data.store.seoDescription || data.store.description || `Get the latest ${data.store.name} coupons and deals.`,
    };
}

export default async function StorePage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ q?: string }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const q = searchParams.q || '';

    const data = await getStoreData(params.slug);

    if (!data) {
        notFound();
    }

    const { store, allCoupons } = data;

    // Filter coupons locally for search if q exists
    const coupons = q
        ? allCoupons.filter((c: any) => c.title.toLowerCase().includes(q.toLowerCase()))
        : allCoupons;

    return (
        <div className="bg-secondary-50 min-h-screen pb-16 pt-8">
            {/* Optimization Hints for Tracking Redirects */}
            {store.affiliateLink && (
                <>
                    <link rel="preconnect" href={new URL(store.affiliateLink).origin} />
                    <link rel="dns-prefetch" href={new URL(store.affiliateLink).origin} />
                </>
            )}
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Sidebar */}
                    <div className="lg:w-[320px] w-full flex-shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-secondary-100 p-8 flex flex-col items-center text-center space-y-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-50 to-white"></div>

                            <div className="w-40 h-40 rounded-3xl bg-white shadow-xl shadow-primary-500/10 border border-primary-100 flex items-center justify-center text-5xl font-bold text-secondary-300 overflow-hidden mb-2 p-5 relative z-10 group">
                                {store.logoUrl ? (
                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="break-all mix-blend-multiply text-primary-300">{store.name.substring(0, 1)}</span>
                                )}
                            </div>

                            <div className="w-full relative z-10">
                                <h1 className="text-3xl font-black text-secondary-900 break-words line-clamp-2">{store.name}</h1>

                                {/* Static Rating for Aesthetics */}
                                <div className="flex items-center justify-center gap-1 mt-3 text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[11px] font-bold text-secondary-400 mt-1.5 uppercase tracking-widest">4.8 out of 5 stars</p>
                            </div>

                            <p className="text-secondary-600 text-sm leading-relaxed border-t border-secondary-100/50 pt-6 break-words relative z-10 font-medium">{store.description}</p>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Store Header with Search */}
                        <div className="bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-secondary-100 p-8 mb-8 flex flex-col gap-6 overflow-hidden">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-3xl font-black text-secondary-900 break-words tracking-tight">{store.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Promo Codes</span></h2>
                                    <div className="h-1.5 w-20 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full mt-3"></div>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    {store.affiliateLink && (
                                        <a
                                            href={store.affiliateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            Visit Store <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Local Search Input */}
                            <div className="pt-2">
                                <form className="relative max-w-xl">
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={q}
                                        placeholder={`Search ${store.name} offers...`}
                                        className="w-full pl-5 pr-12 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl text-sm font-bold text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-inner"
                                    />
                                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {coupons.map((coupon: any) => (
                                    <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border border-secondary-100 shadow-sm px-6">
                                <p className="text-secondary-600 mb-4 font-bold text-lg">No offers found matching your search.</p>
                                <Link href={`/store/${store.slug}`} className="text-primary-600 font-bold hover:underline">Clear search and view all offers</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
