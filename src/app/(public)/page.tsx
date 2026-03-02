
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
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 border border-secondary-100 shadow-sm animate-bounce-subtle">
                                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping"></span>
                                <span className="text-secondary-600 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Verified Deals Added Hourly</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-secondary-900 tracking-tighter leading-[0.85] filter drop-shadow-sm">
                                Unlock the<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 bg-[length:200%_auto] animate-gradient pb-2 inline-block">Secret Savings.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-secondary-600 font-medium max-w-2xl mx-auto leading-relaxed">
                                Don't checkout without us. Find the best promo codes for thousands of stores globally.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <SearchForm />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                            <span className="text-xs font-black text-secondary-400 uppercase tracking-[0.3em] mr-2">Trending</span>
                            {categories.slice(0, 5).map((category: any) => (
                                <Link
                                    key={category._id}
                                    href={`/search?category=${category.slug}`}
                                    className="bg-white hover:bg-primary-50 text-secondary-800 hover:text-primary-700 px-6 py-2.5 rounded-full text-sm font-bold transition-all border border-secondary-200 hover:border-primary-400 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
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
                <section className="py-24 bg-secondary-900 border-y border-secondary-800">
                    <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-left">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                                Exclusive <span className="text-primary-400">Drops.</span>
                            </h2>
                            <p className="text-secondary-400 font-medium text-xl max-w-lg">
                                VIP access to deals you won't find anywhere else on the web.
                            </p>
                        </div>
                        <Link href="/search?filter=exclusive" className="group flex items-center gap-3 text-white bg-white/10 hover:bg-white/20 px-6 py-3 font-bold rounded-full transition-all w-fit">
                            See All Exclusives <ChevronRight size={18} className="group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="flex overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar pl-4 md:pl-[calc((100vw-1536px)/2+2rem)] xl:pl-[calc((100vw-1280px)/2+1rem)] 2xl:pl-[calc((100vw-1536px)/2+1rem)] gap-8" style={{ paddingLeft: 'max(1rem, calc((100vw - 1200px) / 2))' }}>
                        {exclusiveCoupons.map((coupon: any) => (
                            <div key={coupon._id} className="snap-start shrink-0 w-[90vw] md:w-[700px]">
                                <CouponCard coupon={coupon} layout="horizontal" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Deals - Masonry Layout */}
            {featuredCoupons.length > 0 && (
                <section className="container mx-auto px-4 py-24">
                    <div className="mb-16 max-w-2xl">
                        <h2 className="text-5xl font-black text-secondary-900 tracking-tighter mb-4">
                            Handpicked <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">For You.</span>
                        </h2>
                        <p className="text-xl text-secondary-500 font-medium">
                            The most popular, verified discounts trending right now.
                        </p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {featuredCoupons.map((coupon: any) => (
                            <div key={coupon._id} className="break-inside-avoid">
                                <CouponCard coupon={coupon} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/search?filter=featured" className="inline-block bg-white text-secondary-900 border-[3px] border-secondary-900 hover:bg-secondary-900 hover:text-white px-10 py-4 font-black uppercase tracking-widest text-sm transition-colors rounded-xl">
                            Load More Deals
                        </Link>
                    </div>
                </section>
            )}

            {/* Featured Stores - Pill Layout Structure */}
            {popularStores.length > 0 && (
                <section className="bg-secondary-50 py-24 border-t border-secondary-200">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black text-secondary-900 tracking-tight leading-tight mb-6">
                                Top Destinations.
                            </h2>
                            <p className="text-secondary-500 text-xl font-medium">
                                We partner with thousands of brands to bring you savings wherever you shop.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-16 cursor-default">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group flex items-center gap-4 bg-white border border-secondary-200 hover:border-primary-400 rounded-full pr-8 pl-2 py-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-secondary-100 p-2 group-hover:scale-105 transition-transform">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter group-hover:brightness-110" />
                                        ) : (
                                            <span className="font-black text-secondary-400 text-lg mix-blend-multiply">{store.name.substring(0, 1)}</span>
                                        )}
                                    </div>
                                    <span className="font-black text-secondary-800 text-lg group-hover:text-primary-600 transition-colors">
                                        {store.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link href="/stores" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-800 transition-colors">
                                View A-Z Store Directory <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
