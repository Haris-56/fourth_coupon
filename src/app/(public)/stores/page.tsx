
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
            {/* Neo-Brutalist Hero Header */}
            <div className="relative border-b-8 border-secondary-900 overflow-hidden bg-primary-400">
                {/* Minimalist Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#11182722_1px,transparent_1px),linear-gradient(to_bottom,#11182722_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                
                <div className="container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="flex-1 space-y-8 bg-white border-4 border-secondary-900 p-8 shadow-[8px_8px_0_0_#111827]">
                        <h1 className="text-5xl md:text-7xl font-black text-secondary-900 tracking-tighter leading-[1.0] uppercase">
                            Store <br className="hidden md:block"/>Direc<br className="md:hidden"/>
                            <span className="text-primary-600 underline decoration-8 underline-offset-8">tory.</span>
                        </h1>
                        <p className="text-xl text-secondary-600 font-bold border-l-4 border-secondary-900 pl-4 w-fit">
                            Connecting you with the best brands in the world at Saving Dealz Hub.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-xl bg-white border-4 border-secondary-900 p-8 shadow-[8px_8px_0_0_#111827] relative">
                        <h3 className="text-secondary-900 font-black text-2xl mb-6 uppercase tracking-widest">Find Your Favorite</h3>
                        <form action="/stores" method="GET" className="relative group flex gap-2">
                            {selectedChar && <input type="hidden" name="char" value={selectedChar} />}
                            <input
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder="TYPE A STORE NAME..."
                                className="flex-1 bg-[#fafafa] text-secondary-900 placeholder-secondary-400 border-4 border-secondary-900 rounded-none py-4 px-5 focus:outline-none focus:ring-0 focus:bg-primary-50 transition-all font-black uppercase text-sm tracking-widest"
                            />
                            <button type="submit" className="w-14 h-auto bg-primary-500 border-4 border-secondary-900 flex items-center justify-center text-secondary-900 hover:bg-secondary-900 hover:text-white transition-all shadow-[4px_4px_0_0_#111827] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                <Search size={24} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sticky Sidebar Navigation for A-Z */}
                    <div className="lg:w-24 w-full flex-shrink-0 lg:sticky lg:top-28 bg-white border-4 border-secondary-900 p-4 flex lg:flex-col flex-row flex-wrap justify-center gap-2 z-20 shadow-[8px_8px_0_0_#111827]">
                        <Link
                            href={`/stores${q ? `?q=${q}` : ''}`}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-none text-sm font-black transition-all border-2 border-secondary-900",
                                !selectedChar
                                    ? "bg-primary-500 text-secondary-900 shadow-[4px_4px_0_0_#111827] translate-x-1 -translate-y-1"
                                    : "bg-[#fafafa] text-secondary-500 hover:bg-secondary-900 hover:text-white"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}${q ? `&q=${q}` : ''}`}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-none text-sm font-black transition-all border-2 border-secondary-900",
                                    selectedChar === char
                                        ? "bg-primary-500 text-secondary-900 shadow-[4px_4px_0_0_#111827] translate-x-1 -translate-y-1"
                                        : "bg-[#fafafa] text-secondary-500 hover:bg-secondary-900 hover:text-white"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full min-w-0 bg-white border-4 border-secondary-900 p-8 lg:p-14 shadow-[12px_12px_0_0_#111827]">

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
                                            className="group flex items-center gap-4 bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-50 p-3 pr-6 rounded-none transition-all duration-300 hover:shadow-[6px_6px_0_0_#111827] hover:-translate-y-1 hover:translate-x-1"
                                        >
                                            <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center overflow-hidden shrink-0 border-2 border-secondary-900 p-2 group-hover:-translate-y-1 transition-transform">
                                                {store.logoUrl ? (
                                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0" />
                                                ) : (
                                                    <div className="text-2xl font-black text-secondary-900 uppercase tracking-tighter">{store.name.substring(0,2)}</div>
                                                )}
                                            </div>
                                            <span className="font-black text-secondary-900 uppercase tracking-widest text-sm group-hover:text-primary-600 transition-colors truncate">{store.name}</span>
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
                                                        className="group flex items-center gap-4 bg-[#fafafa] border-[3px] border-secondary-900 hover:bg-primary-50 p-3 pr-6 rounded-none transition-all duration-300 hover:shadow-[6px_6px_0_0_#111827] hover:-translate-y-1 hover:translate-x-1"
                                                    >
                                                        <div className="w-14 h-14 bg-white rounded-none flex items-center justify-center overflow-hidden shrink-0 border-2 border-secondary-900 p-2 group-hover:-translate-y-1 transition-transform">
                                                            {store.logoUrl ? (
                                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0" />
                                                            ) : (
                                                                <div className="text-2xl font-black text-secondary-900 uppercase tracking-tighter">{store.name.substring(0,2)}</div>
                                                            )}
                                                        </div>
                                                        <span className="font-black text-secondary-900 uppercase tracking-widest text-sm group-hover:text-primary-600 transition-colors truncate">{store.name}</span>
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
