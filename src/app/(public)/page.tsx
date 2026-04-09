
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
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[0%] w-[50vw] h-[50vw] bg-primary-300/40 rounded-full blur-[120px] animate-pulse mix-blend-multiply"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-400/30 rounded-full blur-[130px] animate-float mix-blend-multiply" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(250,250,250,0.85)_100%)]"></div>
                    
                    {/* Animated grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center animate-slide-up">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-bounce-subtle backdrop-blur-md">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                </span>
                                <span className="text-secondary-800 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase">Verified Deals Added Hourly</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-secondary-900 tracking-tighter leading-[0.9] drop-shadow-sm">
                                Unlock the<br />
                                <span className="text-gradient pb-4 inline-block">Secret Savings.</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-secondary-500 font-medium max-w-2xl mx-auto leading-relaxed">
                                Don't checkout without us. Find the best promo codes for thousands of stores globally.
                            </p>
                        </div>

                        <div className="max-w-3xl mx-auto glow-effect">
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
                <section className="container mx-auto px-4 py-24 relative">
                    <div className="absolute -left-40 top-40 w-96 h-96 bg-primary-300/20 rounded-full blur-[120px] -z-10 mix-blend-multiply"></div>
                    <div className="mb-16 max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-black text-secondary-900 tracking-tighter mb-6 leading-none">
                            Handpicked <br /><span className="text-gradient">For You.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-secondary-500 font-medium pb-2">
                            The most popular, verified discounts trending right now.
                        </p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {featuredCoupons.map((coupon: any) => (
                            <div key={coupon._id} className="break-inside-avoid hover:-translate-y-2 transition-transform duration-500">
                                <CouponCard coupon={coupon} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/search?filter=featured" className="inline-flex items-center justify-center gap-2 bg-secondary-900 text-white hover:bg-primary-600 px-12 py-5 font-black uppercase tracking-[0.2em] text-sm transition-all rounded-full shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1">
                            Load More Deals <ChevronRight size={18} />
                        </Link>
                    </div>
                </section>
            )}

            {/* Featured Stores - Pill Layout Structure */}
            {popularStores.length > 0 && (
                <section className="relative py-28 border-t border-secondary-200/50 bg-white/40 backdrop-blur-3xl overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-pink-300/20 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-5xl md:text-6xl font-black text-secondary-900 tracking-tight leading-tight mb-6">
                                Top Destinations.
                            </h2>
                            <p className="text-secondary-500 text-xl font-medium">
                                We partner with thousands of brands to bring you savings wherever you shop.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-5 max-w-6xl mx-auto mb-16 cursor-default">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group flex items-center gap-4 glass hover:bg-white rounded-full pr-8 pl-2 py-2 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2 border-white/60 hover:border-primary-300"
                                >
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-secondary-100 p-2.5 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter group-hover:brightness-110" />
                                        ) : (
                                            <span className="font-black text-secondary-400 text-xl mix-blend-multiply">{store.name.substring(0, 1)}</span>
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
