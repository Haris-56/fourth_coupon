
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
        <div className="bg-secondary-50 min-h-screen pb-24 font-sans">
            {/* Massive Hero-Style Search Header */}
            <div className="bg-white border-b border-secondary-200 py-12 lg:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <h1 className="text-4xl md:text-6xl font-black text-secondary-900 tracking-tighter leading-tight mb-4">
                            {params.q ? (
                                <>Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">"{params.q}"</span></>
                            ) : params.category ? (
                                <>{categories.find((c: any) => c.slug === params.category)?.name} <span className="text-primary-500">Deals</span></>
                            ) : params.store ? (
                                <>{stores.find((s: any) => s.slug === params.store)?.name} <span className="text-indigo-500">Promos</span></>
                            ) : (
                                <>Find the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Discounts</span></>
                            )}
                        </h1>
                        <p className="text-secondary-500 text-lg font-medium">
                            Showing {total} verified coupons and offers available today.
                        </p>
                    </div>

                    {/* Horizontal Pill Filters */}
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
                                            "px-6 py-3 rounded-full font-bold text-sm transition-all duration-300",
                                            isActive
                                                ? "bg-secondary-900 text-white shadow-lg shadow-secondary-900/20 scale-105"
                                                : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200 hover:text-secondary-900"
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
                                        "shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all snap-start",
                                        !params.category ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white border-secondary-200 text-secondary-600 hover:border-primary-300"
                                    )}
                                >
                                    All
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link
                                        key={cat._id}
                                        href={buildUrl({ category: cat.slug, page: '1' })}
                                        className={cn(
                                            "shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all snap-start",
                                            params.category === cat.slug ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white border-secondary-200 text-secondary-600 hover:border-primary-300"
                                        )}
                                    >
                                        {cat.name}
                                        <span className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full",
                                            params.category === cat.slug ? "bg-primary-200/50 text-primary-800" : "bg-secondary-100 text-secondary-500"
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
                                        "shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all snap-start",
                                        !params.store ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-secondary-200 text-secondary-600 hover:border-indigo-300"
                                    )}
                                >
                                    All
                                </Link>
                                {stores.map((store: any) => (
                                    <Link
                                        key={store._id}
                                        href={buildUrl({ store: store.slug, page: '1' })}
                                        className={cn(
                                            "shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all snap-start",
                                            params.store === store.slug ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-secondary-200 text-secondary-600 hover:border-indigo-300"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {coupons.map((coupon: any) => (
                        <div key={coupon._id} className="h-full">
                            <CouponCard coupon={coupon} />
                        </div>
                    ))}
                    {coupons.length === 0 && (
                        <div className="col-span-full bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-secondary-200">
                            <div className="text-6xl mb-6">🕵️‍♂️</div>
                            <h2 className="text-3xl font-black text-secondary-900 mb-4 tracking-tight">No deals found!</h2>
                            <p className="text-secondary-500 font-medium text-lg mb-8 max-w-md mx-auto">We couldn't find any active offers matching your current filters. Try exploring other categories.</p>
                            <Link href="/" className="inline-flex items-center justify-center bg-secondary-900 hover:bg-primary-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl active:scale-95">
                                Clear All Filters
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-20 gap-3">
                        {page > 1 && (
                            <Link
                                href={buildUrl({ page: (page - 1).toString() })}
                                className="w-14 h-14 rounded-full bg-white text-secondary-900 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 border-2 border-secondary-200 hover:border-primary-200 transition-all font-black text-xl shadow-sm"
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
                                        "w-14 h-14 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300",
                                        page === p
                                            ? 'bg-secondary-900 text-white shadow-xl shadow-secondary-900/20 scale-110'
                                            : 'bg-white text-secondary-500 hover:bg-secondary-100 border-2 border-secondary-200 hover:border-secondary-300 shadow-sm'
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
