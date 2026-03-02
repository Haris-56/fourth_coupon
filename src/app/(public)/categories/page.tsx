
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Minimalist Split Header */}
            <div className="bg-secondary-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent"></div>
                <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col md:flex-row items-end justify-between gap-10">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
                            Discover <br />
                            <span className="text-primary-400">Interests.</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-primary-500 rounded-full"></span>
                            <p className="text-xl text-secondary-400 font-medium">Over {categories.length} categories to explore</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refined Uniform Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.map((category: any) => {
                        return (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="group relative bg-secondary-50 p-6 rounded-[2rem] overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-primary-100/50 hover:bg-white hover:shadow-xl hover:shadow-primary-500/5"
                            >
                                {/* Subtle Background Pattern */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white shadow-md flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
                                        {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                            <i className={`text-2xl text-primary-600 ${category.imageUrl}`}></i>
                                        ) : category.imageUrl ? (
                                            <img src={category.imageUrl} alt={category.name} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <span className="text-xl font-black text-secondary-300">{category.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h2 className="font-black text-secondary-900 group-hover:text-primary-600 transition-colors text-lg leading-tight">
                                        {category.name}
                                    </h2>
                                    <div className="mt-2 h-1 w-0 group-hover:w-12 bg-primary-500 rounded-full transition-all duration-500"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
