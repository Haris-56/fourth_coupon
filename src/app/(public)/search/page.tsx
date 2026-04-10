
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';
import StoreModel from '@/models/Store';
import { CouponCard } from '@/components/CouponCard';
import { Search, Tag, Store } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getSearchData(searchParams: { category?: string; store?: string; q?: string; type?: string; page?: string }) {
    await connectToDatabase();

    const query: any = { isActive: true };
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter by Category Slug
    if (searchParams.category) {
        const category = await Category.findOne({ slug: searchParams.category });
        if (category) {
            query.category = category._id;
        }
    }

    // Filter by Store Slug
    if (searchParams.store) {
        const store = await StoreModel.findOne({ slug: searchParams.store });
        if (store) {
            query.store = store._id;
        }
    }

    // Filter by Search Query
    if (searchParams.q) {
        query.$or = [
            { title: { $regex: searchParams.q, $options: 'i' } },
            { description: { $regex: searchParams.q, $options: 'i' } }
        ];
    }

    // Filter by Type
    if (searchParams.type === 'exclusive') query.isExclusive = true;
    if (searchParams.type === 'verified') query.isVerified = true;
    if (searchParams.type === 'featured') query.isFeatured = true;

    const [coupons, total, allCategories, allStores] = await Promise.all([
        Coupon.find(query).populate('store').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Coupon.countDocuments(query),
        Category.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'coupons'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    count: { $size: { $filter: { input: '$coupons', as: 'c', cond: { $eq: ['$$c.isActive', true] } } } }
                }
            },
            { $sort: { name: 1 } }
        ]),
        StoreModel.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'store',
                    as: 'coupons'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    count: { $size: { $filter: { input: '$coupons', as: 'c', cond: { $eq: ['$$c.isActive', true] } } } }
                }
            },
            { $sort: { count: -1, name: 1 } },
            { $limit: 15 }
        ])
    ]);

    return {
        coupons: JSON.parse(JSON.stringify(coupons)),
        categories: JSON.parse(JSON.stringify(allCategories)),
        stores: JSON.parse(JSON.stringify(allStores)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function SearchPage(props: { searchParams: Promise<any> }) {
    const params = await props.searchParams;
    const { coupons, categories, stores, total, page, totalPages } = await getSearchData(params);
    const q = params.q || '';

    const buildUrl = (updatedParams: any) => {
        const newParams = new URLSearchParams();
        Object.entries({ ...params, ...updatedParams }).forEach(([key, value]) => {
            if (value && value !== 'all') newParams.set(key, value as string);
        });
        return `/search?${newParams.toString()}`;
    };

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            {/* Neo-Brutalist Search Header */}
            <div className="relative border-b-8 border-secondary-900 py-12 lg:py-16 bg-primary-400 overflow-hidden">
                {/* Minimalist Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="container mx-auto px-4 max-w-7xl relative z-10 bg-white border-4 border-secondary-900 p-10 mt-6 shadow-[12px_12px_0_0_#111827]">
                    <div className="text-center max-w-3xl mx-auto mb-10 border-b-4 border-dashed border-secondary-200 pb-10">
                        <h1 className="text-4xl md:text-6xl font-black text-secondary-900 tracking-tighter leading-none mb-6 uppercase">
                            {params.q ? (
                                <>Results for <span className="text-primary-600 underline decoration-8 underline-offset-4">"{params.q}"</span></>
                            ) : params.category ? (
                                <>{categories.find((c: any) => c.slug === params.category)?.name} <span className="text-primary-600 underline decoration-8 underline-offset-4">Deals</span></>
                            ) : params.store ? (
                                <>{stores.find((s: any) => s.slug === params.store)?.name} <span className="text-primary-600 underline decoration-8 underline-offset-4">Promos</span></>
                            ) : (
                                <>Find the best <span className="text-primary-600 underline decoration-8 underline-offset-4">Discounts</span></>
                            )}
                        </h1>
                        <div className="inline-block bg-secondary-900 text-white font-black px-6 py-2 uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#9333EA]">
                            {total} VERIFIED OFFERS
                        </div>
                    </div>

                    {/* Filters container */}
                    <div className="space-y-6">
                        {/* Type Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                                { label: 'All Offers', value: '' },
                                { label: 'Exclusive Deals', value: 'exclusive' },
                                { label: 'Verified Codes', value: 'verified' },
                                { label: 'Featured Promos', value: 'featured' }
                            ].map((type) => {
                                const isActive = params.type === type.value || (!params.type && type.value === '');
                                return (
                                    <Link
                                        key={type.value}
                                        href={buildUrl({ type: type.value, page: '1' })}
                                        className={cn(
                                            "px-6 py-3 rounded-none font-black text-sm transition-all border-[3px] border-secondary-900 uppercase tracking-widest",
                                            isActive
                                                ? "bg-primary-500 text-secondary-900 shadow-[4px_4px_0_0_#111827] translate-x-1 -translate-y-1"
                                                : "bg-[#fafafa] text-secondary-600 hover:bg-secondary-900 hover:text-white"
                                        )}
                                    >
                                        {type.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Scrolling Category Pills */}
                        <div className="relative pt-6 border-t border-secondary-100">
                            <div className="flex items-center gap-3 px-4 pb-4 overflow-x-auto hide-scrollbar snap-x">
                                <span className="text-xs font-black text-secondary-400 uppercase tracking-widest shrink-0 mr-4">Categories</span>
                                <Link
                                    href={buildUrl({ category: 'all', page: '1' })}
                                    className={cn(
                                        "shrink-0 px-6 py-3 rounded-none text-sm font-black transition-all snap-start border-[3px] border-secondary-900 uppercase tracking-widest",
                                        !params.category ? "bg-secondary-900 text-white shadow-[4px_4px_0_0_#9333EA] translate-x-1 -translate-y-1" : "bg-[#fafafa] hover:bg-primary-50"
                                    )}
                                >
                                    All
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link
                                        key={cat._id}
                                        href={buildUrl({ category: cat.slug, page: '1' })}
                                        className={cn(
                                            "shrink-0 flex items-center gap-3 px-6 py-3 rounded-none text-sm font-black transition-all snap-start border-[3px] border-secondary-900 uppercase tracking-widest",
                                            params.category === cat.slug ? "bg-secondary-900 text-white shadow-[4px_4px_0_0_#9333EA] translate-x-1 -translate-y-1" : "bg-[#fafafa] hover:bg-primary-50"
                                        )}
                                    >
                                        {cat.name}
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-none border-2",
                                            params.category === cat.slug ? "bg-white text-secondary-900 border-white" : "bg-white border-secondary-900 text-secondary-900"
                                        )}>{cat.count}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Scrolling Store Pills */}
                        <div className="relative pt-2">
                            <div className="flex items-center gap-3 px-4 pb-4 overflow-x-auto hide-scrollbar snap-x">
                                <span className="text-xs font-black text-secondary-400 uppercase tracking-widest shrink-0 mr-4">Top Brands</span>
                                <Link
                                    href={buildUrl({ store: 'all', page: '1' })}
                                    className={cn(
                                        "shrink-0 px-6 py-3 rounded-none text-sm font-black transition-all snap-start border-[3px] border-secondary-900 uppercase tracking-widest",
                                        !params.store ? "bg-pink-400 text-secondary-900 shadow-[4px_4px_0_0_#111827] translate-x-1 -translate-y-1" : "bg-[#fafafa] hover:bg-primary-50"
                                    )}
                                >
                                    All
                                </Link>
                                {stores.map((store: any) => (
                                    <Link
                                        key={store._id}
                                        href={buildUrl({ store: store.slug, page: '1' })}
                                        className={cn(
                                            "shrink-0 flex items-center gap-3 px-6 py-3 rounded-none text-sm font-black transition-all snap-start border-[3px] border-secondary-900 uppercase tracking-widest",
                                            params.store === store.slug ? "bg-pink-400 text-secondary-900 shadow-[4px_4px_0_0_#111827] translate-x-1 -translate-y-1" : "bg-[#fafafa] hover:bg-primary-50"
                                        )}
                                    >
                                        {store.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid - Changed to vertical layout */}
            <div className="container mx-auto px-4 max-w-7xl pt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coupons.map((coupon: any) => (
                        <div key={coupon._id} className="h-full">
                            <CouponCard coupon={coupon} layout="horizontal" />
                        </div>
                    ))}
                    {coupons.length === 0 && (
                        <div className="col-span-full bg-white p-16 border-4 border-secondary-900 text-center shadow-[12px_12px_0_0_#111827]">
                            <div className="text-8xl mb-6 grayscale">🕵️‍♂️</div>
                            <h2 className="text-4xl font-black text-secondary-900 mb-6 tracking-tighter uppercase">No deals found!</h2>
                            <p className="text-secondary-600 font-bold text-lg mb-8 max-w-md mx-auto uppercase tracking-widest border-l-4 border-primary-500 pl-4">We couldn't find any active offers matching your filters.</p>
                            <Link href="/" className="inline-flex items-center justify-center bg-primary-500 text-secondary-900 border-[3px] border-secondary-900 px-10 py-5 font-black uppercase tracking-widest text-lg transition-all shadow-[6px_6px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-secondary-900 hover:text-white">
                                Clear All Filters
                            </Link>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-20 gap-4">
                        {page > 1 && (
                            <Link
                                href={buildUrl({ page: (page - 1).toString() })}
                                className="w-14 h-14 bg-white text-secondary-900 flex items-center justify-center hover:bg-primary-500 border-[3px] border-secondary-900 transition-all font-black text-2xl shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                &larr;
                            </Link>
                        )}

                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                                if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center px-4 text-secondary-300 font-black text-xl tracking-widest">...</span>;
                                return null;
                            }
                            return (
                                <Link
                                    key={p}
                                    href={buildUrl({ page: p.toString() })}
                                    className={cn(
                                        "w-14 h-14 border-[3px] border-secondary-900 flex items-center justify-center font-black text-xl transition-all duration-300 active:translate-x-1 active:translate-y-1 active:shadow-none",
                                        page === p
                                            ? 'bg-secondary-900 text-white shadow-[4px_4px_0_0_#9333EA] translate-x-1 -translate-y-1'
                                            : 'bg-white text-secondary-900 hover:bg-primary-500 shadow-[4px_4px_0_0_#111827]'
                                    )}
                                >
                                    {p}
                                </Link>
                            );
                        })}

                        {page < totalPages && (
                            <Link
                                href={buildUrl({ page: (page + 1).toString() })}
                                className="w-14 h-14 rounded-full bg-white text-secondary-900 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 border-2 border-secondary-200 hover:border-primary-200 transition-all font-black text-xl shadow-sm"
                            >
                                &rarr;
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
