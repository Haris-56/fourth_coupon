
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
                <div className="relative flex items-center bg-secondary-50 border border-secondary-200 rounded-full focus-within:ring-2 focus-within:ring-primary-500 focus-within:bg-white transition-all">
                    <SearchIcon className="ml-4 text-secondary-400 w-4 h-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for stores and brands..."
                        className="w-full py-2 px-3 bg-transparent rounded-full focus:outline-none text-secondary-700 text-sm placeholder:text-secondary-400 font-light"
                    />
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-primary-900/5 ring-1 ring-secondary-200/50 p-2 focus-within:ring-2 focus-within:ring-primary-400 focus-within:shadow-primary-500/10 transition-all">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary-50 rounded-full ml-1 shrink-0">
                    <SearchIcon className="text-primary-500 w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for stores like 'Nike', 'Amazon'..."
                    className="w-full py-4 px-4 bg-transparent focus:outline-none text-secondary-800 text-base placeholder:text-secondary-400 font-bold"
                />
                <button type="submit" className="shrink-0 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:from-primary-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg hover:shadow-primary-600/20 active:scale-95">
                    Search Offers
                </button>
            </div>
        </form>
    );
}
