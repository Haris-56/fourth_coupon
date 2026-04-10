
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import { CouponCard } from '@/components/CouponCard';
import { notFound } from 'next/navigation';
import { ExternalLink, Share2, Search } from 'lucide-react';
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
        <div className="bg-[#fafafa] relative min-h-screen pb-16 pt-8 overflow-hidden bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]">
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
                    <div className="lg:w-[320px] w-full flex-shrink-0 lg:sticky lg:top-32">
                        <div className="bg-white border-4 border-secondary-900 p-8 flex flex-col items-center text-center space-y-6 overflow-hidden relative shadow-[8px_8px_0_0_#111827]">
                            <div className="w-40 h-40 rounded-none bg-white border-4 border-secondary-900 flex items-center justify-center text-5xl font-black text-secondary-900 overflow-hidden mb-2 p-5 relative z-10 shadow-[4px_4px_0_0_#111827]">
                                {store.logoUrl ? (
                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter grayscale" />
                                ) : (
                                    <span className="break-all">{store.name.substring(0, 2).toUpperCase()}</span>
                                )}
                            </div>

                            <div className="w-full relative z-10">
                                <h1 className="text-3xl font-black text-secondary-900 break-words line-clamp-2 uppercase tracking-tighter">{store.name}</h1>

                                {/* Static Rating for Aesthetics */}
                                <div className="flex items-center justify-center gap-1 mt-3 text-secondary-900">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[11px] font-black text-secondary-600 mt-1.5 uppercase tracking-widest">4.8 OUT OF 5</p>
                            </div>

                            <p className="text-secondary-600 text-sm leading-relaxed border-t-4 border-dashed border-secondary-300 pt-6 break-words relative z-10 font-bold">{store.description}</p>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Store Header with Search */}
                        <div className="bg-white rounded-none shadow-[12px_12px_0_0_#111827] border-4 border-secondary-900 p-8 mb-8 flex flex-col gap-6 relative">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-4xl md:text-5xl font-black text-secondary-900 break-words tracking-tighter uppercase">{store.name} <span className="text-secondary-900 underline decoration-8 underline-offset-4 decoration-primary-500">PROMO CODES</span></h2>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    {store.affiliateLink && (
                                        <a
                                            href={store.affiliateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-primary-500 text-secondary-900 border-[3px] border-secondary-900 hover:bg-secondary-900 hover:text-white px-8 py-3 rounded-none font-black text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                        >
                                            Visit Store <ExternalLink size={20} strokeWidth={3} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Local Search Input */}
                            <div className="pt-4 border-t-4 border-secondary-900">
                                <form className="relative max-w-xl">
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={q}
                                        placeholder={`SEARCH ${store.name.toUpperCase()} OFFERS...`}
                                        className="w-full pl-5 pr-12 py-4 bg-[#fafafa] border-4 border-secondary-900 rounded-none text-sm font-black text-secondary-900 focus:outline-none focus:ring-0 focus:bg-primary-50 transition-all uppercase tracking-widest"
                                    />
                                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-900 hover:text-primary-600 transition-colors">
                                        <Search size={24} strokeWidth={3} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                                {coupons.map((coupon: any) => (
                                    <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white border-4 border-secondary-900 shadow-[8px_8px_0_0_#111827] px-6">
                                <div className="text-6xl mb-6 grayscale">🥴</div>
                                <p className="text-secondary-900 mb-4 font-black text-xl uppercase tracking-widest">No offers found matching your search.</p>
                                <Link href={`/store/${store.slug}`} className="text-primary-600 font-black hover:underline uppercase tracking-widest underline-offset-4">CLEAR SEARCH AND VIEW ALL OFFERS</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
