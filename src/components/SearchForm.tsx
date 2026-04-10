
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ compact = false }: { compact?: boolean }) {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    if (compact) {
        return (
            <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative flex items-center bg-[#fafafa] border-[3px] border-secondary-900 focus-within:ring-0 focus-within:bg-white transition-all shadow-[4px_4px_0_0_#111827]">
                    <SearchIcon className="ml-4 text-secondary-900 w-5 h-5 flex-shrink-0" strokeWidth={3} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="SEARCH STORES..."
                        className="w-full py-3 px-4 bg-transparent focus:outline-none text-secondary-900 text-sm font-black uppercase tracking-widest placeholder:text-secondary-400"
                    />
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            <div className="relative flex items-center bg-white border-[3px] border-secondary-900 transition-all p-1 shadow-[8px_8px_0_0_#111827]">
                <div className="flex items-center justify-center w-14 h-14 bg-secondary-900 text-white ml-1 shrink-0">
                    <SearchIcon className="w-6 h-6" strokeWidth={3} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH FOR STORES LIKE 'NIKE'..."
                    className="w-full py-4 px-6 bg-transparent focus:outline-none text-secondary-900 text-lg font-black uppercase tracking-widest placeholder:text-secondary-400"
                />
                <button type="submit" className="shrink-0 bg-primary-500 text-secondary-900 border-[3px] border-secondary-900 hover:bg-secondary-900 hover:text-white px-8 py-4 font-black text-sm uppercase tracking-widest transition-all active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_0_#111827] active:shadow-none mr-1">
                    Search Offers
                </button>
            </div>
        </form>
    );
}
