
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStores() {
    await connectToDatabase();
    const stores = await StoreModel.find({ isActive: true }).select('name slug logoUrl').sort({ name: 1 });
    return JSON.parse(JSON.stringify(stores));
}

export default async function StoresPage(props: { searchParams: Promise<{ char?: string; q?: string }> }) {
    const searchParams = await props.searchParams;
    const stores = await getStores();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

    const selectedChar = (searchParams.char || '').toUpperCase();
    const q = (searchParams.q || '').toLowerCase();

    const filteredStores = stores.filter((store: any) => {
        const nameMatch = q ? store.name.toLowerCase().includes(q) : true;

        if (selectedChar) {
            const firstChar = store.name.charAt(0).toUpperCase();
            const charMatch = /^\d/.test(selectedChar)
                ? firstChar === selectedChar
                : firstChar === selectedChar;
            return nameMatch && charMatch;
        }

        return nameMatch;
    });

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            {/* Split Hero Header */}
            <div className="relative border-b border-secondary-200 overflow-hidden bg-secondary-950">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[100px] animate-float pointer-events-none"></div>
                <div className="container mx-auto px-4 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-md">
                            The ultimate <br />
                            <span className="text-gradient">brand catalog.</span>
                        </h1>
                        <p className="text-xl text-secondary-500 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                            Search thousands of top-tier stores and unlock exclusive verified discounts instantly.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-xl glass-dark rounded-[2.5rem] p-8 relative overflow-hidden">
                        <h3 className="text-white font-bold text-xl mb-6">Find Your Favorite</h3>
                        <form action="/stores" method="GET" className="relative group">
                            {selectedChar && <input type="hidden" name="char" value={selectedChar} />}
                            <input
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder="Type a store name..."
                                className="w-full bg-white/10 text-white placeholder-secondary-400 border border-white/20 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all font-bold backdrop-blur-sm"
                            />
                            <div className="glow-effect absolute right-3 top-1/2 -translate-y-1/2">
                                <button type="submit" className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-all">
                                    <Search size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sticky Sidebar Navigation for A-Z */}
                    <div className="lg:w-24 w-full flex-shrink-0 lg:sticky lg:top-28 glass rounded-[2rem] p-4 flex lg:flex-col flex-row flex-wrap justify-center gap-2 z-20">
                        <Link
                            href={`/stores${q ? `?q=${q}` : ''}`}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                                !selectedChar
                                    ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 scale-105"
                                    : "bg-white/50 text-secondary-500 hover:bg-white hover:text-primary-600 shadow-sm"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}${q ? `&q=${q}` : ''}`}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                                    selectedChar === char
                                        ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 scale-105"
                                        : "bg-white/50 text-secondary-500 hover:bg-white hover:text-primary-600 shadow-sm"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full min-w-0 glass rounded-[3rem] p-8 lg:p-14">

                        {selectedChar ? (
                            <div className="animate-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                                        <h2 className="text-4xl font-black text-primary-600">{selectedChar}</h2>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-500 uppercase tracking-widest">{filteredStores.length} Stores Found</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredStores.map((store: any) => (
                                        <Link
                                            href={`/store/${store.slug}`}
                                            key={store._id}
                                            className="group flex items-center gap-4 bg-white/50 backdrop-blur-md hover:bg-white border-2 border-transparent hover:border-primary-300 p-3 pr-6 rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1"
                                        >
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white shadow-md p-2 group-hover:rotate-6 group-hover:scale-110 transition-transform">
                                                {store.logoUrl ? (
                                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter group-hover:brightness-110" />
                                                ) : (
                                                    <div className="text-xl font-black text-secondary-300 mix-blend-multiply">{store.name.charAt(0)}</div>
                                                )}
                                            </div>
                                            <span className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">{store.name}</span>
                                        </Link>
                                    ))}
                                    {filteredStores.length === 0 && <p className="text-secondary-500 font-medium italic col-span-full py-10">No stores found.</p>}
                                </div>
                            </div>
                        ) : (
                            // Show all filtered stores grouped by letter in a more structural list
                            <div className="space-y-16">
                                {alphabet.map(char => {
                                    const charStores = filteredStores.filter((s: any) => s.name.charAt(0).toUpperCase() === char);
                                    if (charStores.length === 0) return null;
                                    return (
                                        <div key={char} className="animate-in slide-in-from-bottom-8 duration-700 relative pl-8 border-l-[3px] border-secondary-100">
                                            <div className="absolute -left-[27px] top-0 w-12 h-12 bg-white border-[3px] border-primary-100 rounded-full flex items-center justify-center shadow-sm">
                                                <h2 className="text-2xl font-black text-primary-600">{char}</h2>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                                {charStores.map((store: any) => (
                                                    <Link
                                                        href={`/store/${store.slug}`}
                                                        key={store._id}
                                                        className="group flex items-center gap-4 bg-white/50 backdrop-blur-md hover:bg-white border-2 border-transparent hover:border-primary-300 p-3 pr-6 rounded-[2rem] transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1"
                                                    >
                                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white shadow-md p-2 group-hover:rotate-6 group-hover:scale-110 transition-transform">
                                                            {store.logoUrl ? (
                                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter group-hover:brightness-110" />
                                                            ) : (
                                                                <div className="text-xl font-black text-secondary-300 mix-blend-multiply">{store.name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">{store.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredStores.length === 0 && (
                                    <div className="text-center py-20 bg-secondary-50 rounded-3xl border border-secondary-200 border-dashed">
                                        <div className="text-6xl mb-4">🥴</div>
                                        <p className="text-secondary-600 font-bold text-xl w-full">No stores found matching "{q}".</p>
                                        <Link href="/stores" className="text-primary-600 font-black hover:underline mt-4 inline-block tracking-widest uppercase text-sm">Clear Search</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
