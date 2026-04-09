
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
        <div className="bg-[#fafafa] min-h-screen font-sans">
            {/* Minimalist Split Header */}
            <div className="bg-secondary-950 overflow-hidden relative rounded-b-[4rem] shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent"></div>
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[100px] animate-float"></div>
                
                <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col md:flex-row items-end justify-between gap-10">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none drop-shadow-lg">
                            Discover <br />
                            <span className="text-gradient">Interests.</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="w-12 h-1 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full"></span>
                            <p className="text-xl text-secondary-300 font-medium">Over {categories.length} categories to explore</p>
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
                                className="glass group relative p-6 rounded-[2rem] overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-500 hover:border-primary-300/50 hover:shadow-2xl hover:shadow-primary-500/10"
                            >
                                {/* Subtle Background Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-[4rem] opacity-30 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white/80 backdrop-blur-md shadow-md border border-white flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                        {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                            <i className={`text-2xl text-primary-500 ${category.imageUrl}`}></i>
                                        ) : category.imageUrl ? (
                                            <img src={category.imageUrl} alt={category.name} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <span className="text-xl font-black text-secondary-300">{category.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <h2 className="font-black text-secondary-900 group-hover:text-primary-600 transition-colors text-lg leading-tight">
                                        {category.name}
                                    </h2>
                                    <div className="mt-2 h-1 w-0 group-hover:w-16 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full transition-all duration-500"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
