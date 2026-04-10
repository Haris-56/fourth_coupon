
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
            {/* Neo-Brutalist Header */}
            <div className="bg-primary-400 overflow-hidden relative border-b-8 border-secondary-900">
                {/* Minimalist Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                
                <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 flex flex-col md:flex-row items-end justify-between gap-10">
                    <div className="bg-white border-4 border-secondary-900 p-8 shadow-[8px_8px_0_0_#111827]">
                        <h1 className="text-6xl md:text-8xl font-black text-secondary-900 tracking-tighter mb-6 leading-none uppercase">
                            Browse <br />
                            <span className="text-primary-600 underline decoration-8 underline-offset-8">Hub.</span>
                        </h1>
                        <div className="flex items-center gap-3 bg-secondary-900 text-white px-6 py-2 w-fit">
                            <span className="text-xl font-bold uppercase tracking-widest">{categories.length} categories</span>
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
                                className="bg-white relative p-6 border-4 border-secondary-900 overflow-hidden flex flex-col items-center text-center hover:-translate-y-2 hover:translate-x-1 hover:shadow-[8px_8px_0_0_#9333EA] hover:bg-primary-50 transition-all duration-300"
                            >
                                <div className="relative z-10 w-full flex flex-col items-center">
                                    <div className="w-20 h-20 bg-[#fafafa] border-4 border-secondary-900 flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#111827] group-hover:-translate-y-2 transition-transform duration-300">
                                        {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                            <i className={`text-4xl text-secondary-900 ${category.imageUrl}`}></i>
                                        ) : category.imageUrl ? (
                                            <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain grayscale" />
                                        ) : (
                                            <span className="text-2xl font-black text-secondary-900">{category.name.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <h2 className="font-black text-secondary-900 group-hover:text-primary-600 transition-colors text-2xl uppercase tracking-tighter leading-none border-b-4 border-transparent group-hover:border-primary-600">
                                        {category.name}
                                    </h2>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
