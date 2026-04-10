
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import Category from '@/models/Category';
import { CouponCard } from '@/components/CouponCard';
import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';

export const dynamic = 'force-dynamic';

async function getHomeData() {
    await connectToDatabase();

    const [featuredCoupons, exclusiveCoupons, popularStores, categories] = await Promise.all([
        Coupon.find({ isFeatured: true, isActive: true }).populate('store').limit(6).sort({ updatedAt: -1 }),
        Coupon.find({ isExclusive: true, isActive: true }).populate('store').limit(8).sort({ updatedAt: -1 }),
        StoreModel.find({ isFeatured: true, isActive: true }).limit(20), // Increased limit for text list
        Category.find({ isFeatured: true, isActive: true }).limit(6)
    ]);

    return {
        featuredCoupons: JSON.parse(JSON.stringify(featuredCoupons)),
        exclusiveCoupons: JSON.parse(JSON.stringify(exclusiveCoupons)),
        popularStores: JSON.parse(JSON.stringify(popularStores)),
        categories: JSON.parse(JSON.stringify(categories)),
    };
}

export default async function HomePage() {
    const { featuredCoupons, exclusiveCoupons, popularStores, categories } = await getHomeData();

    return (
        <div className="space-y-24 pb-24 bg-[#fafafa]">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b-8 border-secondary-900 bg-primary-400">
                {/* Minimalist Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="space-y-8 bg-white border-4 border-secondary-900 p-8 md:p-16 shadow-[12px_12px_0_0_#111827]">
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-secondary-900 border-2 border-secondary-900">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full bg-primary-400 opacity-75"></span>
                                  <span className="relative inline-flex h-3 w-3 bg-primary-500"></span>
                                </span>
                                <span className="text-white text-xs md:text-sm font-black tracking-widest uppercase">Verified Deals Added Hourly</span>
                            </div>

                            <h1 className="text-7xl md:text-9xl font-black text-secondary-900 tracking-tighter leading-[0.9] uppercase">
                                Saving <br className="hidden md:block" />Dealz<br className="md:hidden"/>
                                <span className="text-primary-600 underline decoration-[12px] underline-offset-8 inline-block pb-4">Hub.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-secondary-600 font-bold max-w-2xl mx-auto leading-relaxed border-l-4 border-secondary-900 pl-4">
                                The ultimate destination for verified discounts. Stop overpaying and start saving today with Saving Dealz Hub.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto bg-white border-4 border-secondary-900 p-4 shadow-[8px_8px_0_0_#111827]">
                            <SearchForm />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <span className="bg-secondary-900 text-white font-black px-3 py-1 text-sm tracking-widest uppercase">Trending</span>
                            {categories.slice(0, 5).map((category: any) => (
                                <Link
                                    key={category._id}
                                    href={`/search?category=${category.slug}`}
                                    className="bg-white hover:bg-secondary-900 hover:text-white text-secondary-900 border-[3px] border-secondary-900 px-6 py-2.5 text-sm font-black transition-all uppercase tracking-widest shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Coupons - Horizontal Scroll Layout */}
            {exclusiveCoupons.length > 0 && (
                <section className="py-24 bg-white border-y-8 border-secondary-900">
                    <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-left bg-primary-400 border-4 border-secondary-900 p-6 shadow-[8px_8px_0_0_#111827]">
                            <h2 className="text-5xl md:text-7xl font-black text-secondary-900 tracking-tighter uppercase mb-4 leading-none">
                                Exclusive <span className="bg-secondary-900 text-white px-2">Drops.</span>
                            </h2>
                            <p className="text-secondary-900 font-bold text-xl max-w-lg border-l-4 border-secondary-900 pl-4">
                                VIP access to deals you won't find anywhere else.
                            </p>
                        </div>
                        <Link href="/search?filter=exclusive" className="group flex items-center justify-center gap-3 text-secondary-900 bg-white border-4 border-secondary-900 px-8 py-4 font-black transition-all hover:bg-secondary-900 hover:text-white shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest text-lg w-full md:w-auto">
                            See All Exclusives <ChevronRight size={24} className="group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar pl-4 md:pl-[calc((100vw-1536px)/2+2rem)] xl:pl-[calc((100vw-1280px)/2+1rem)] 2xl:pl-[calc((100vw-1536px)/2+1rem)] gap-8" style={{ paddingLeft: 'max(1rem, calc((100vw - 1200px) / 2))' }}>
                        {exclusiveCoupons.map((coupon: any) => (
                            <div key={coupon._id} className="snap-start shrink-0 w-[90vw] md:w-[700px] h-full">
                                <CouponCard coupon={coupon} layout="horizontal" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Deals - Masonry Layout */}
            {featuredCoupons.length > 0 && (
                <section className="container mx-auto px-4 py-12 relative">
                    <div className="mb-16 max-w-2xl bg-white border-4 border-secondary-900 p-8 shadow-[8px_8px_0_0_#111827]">
                        <h2 className="text-6xl md:text-7xl font-black text-secondary-900 tracking-tighter mb-6 leading-none uppercase">
                            Handpicked <br /><span className="text-primary-600 underline decoration-8">For You.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-secondary-600 font-bold border-l-4 border-secondary-900 pl-4 uppercase tracking-widest text-sm">
                            The most popular discounts right now.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCoupons.map((coupon: any) => (
                            <div key={coupon._id} className="h-full">
                                <CouponCard coupon={coupon} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/search?filter=featured" className="inline-flex items-center justify-center gap-2 bg-primary-500 text-secondary-900 hover:bg-secondary-900 hover:text-white border-[3px] border-secondary-900 px-12 py-5 font-black uppercase tracking-widest text-lg transition-all shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                            Load More Deals <ChevronRight size={24} strokeWidth={3} />
                        </Link>
                    </div>
                </section>
            )}

            {/* Featured Stores - Pill Layout Structure */}
            {popularStores.length > 0 && (
                <section className="relative py-24 border-t-8 border-secondary-900 bg-primary-400 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-20 max-w-3xl mx-auto bg-white border-4 border-secondary-900 p-8 shadow-[12px_12px_0_0_#111827]">
                            <h2 className="text-6xl md:text-7xl font-black text-secondary-900 tracking-tighter leading-none mb-6 uppercase">
                                Top Destinations.
                            </h2>
                            <p className="text-secondary-600 text-xl font-bold uppercase tracking-widest border-l-4 border-secondary-900 pl-4 inline-block">
                                Savings wherever you shop.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-16 cursor-default">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group flex flex-col items-center bg-[#fafafa] hover:bg-white border-[3px] border-secondary-900 p-6 transition-all duration-300 hover:shadow-[6px_6px_0_0_#111827] hover:-translate-y-2 hover:translate-x-1"
                                >
                                    <div className="w-16 h-16 bg-white flex items-center justify-center overflow-hidden shrink-0 border-[3px] border-secondary-900 p-2 shadow-[2px_2px_0_0_#111827] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 mb-4">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0" />
                                        ) : (
                                            <span className="font-black text-secondary-900 text-2xl uppercase tracking-tighter">{store.name.substring(0, 2)}</span>
                                        )}
                                    </div>
                                    <span className="font-black text-secondary-900 text-sm uppercase tracking-widest group-hover:text-primary-600 transition-colors">
                                        {store.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link href="/stores" className="inline-flex items-center gap-2 bg-white border-[3px] border-secondary-900 text-secondary-900 font-black hover:bg-secondary-900 hover:text-white transition-all px-8 py-4 shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest">
                                View A-Z Directory <ChevronRight size={24} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
