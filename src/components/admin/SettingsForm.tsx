
'use client';

import { useActionState, useEffect } from 'react';
import { Save, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateSettings } from '@/actions/settings';
import { ISettings } from '@/models/Settings';

export default function SettingsForm({ initialData }: { initialData: any }) {
    const [state, action, isPending] = useActionState(updateSettings, undefined);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <form action={action} className="space-y-6 pb-20">
            {state?.message && (
                <div className={cn(
                    "p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300",
                    state.success ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                )}>
                    {state.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-medium">{state.message}</p>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Site Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Maintenance Mode */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Maintenance Mode</label>
                            <select
                                name="maintenanceMode"
                                defaultValue={initialData?.maintenanceMode ? 'enabled' : 'disabled'}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                                <option value="disabled">Disabled (Live)</option>
                                <option value="enabled">Enabled (Maintenance)</option>
                            </select>
                        </div>

                        {/* Language Direction */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Language Direction</label>
                            <select
                                name="languageDirection"
                                defaultValue={initialData?.languageDirection || 'LTR'}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                                <option value="LTR">Left to Right (LTR)</option>
                                <option value="RTL">Right to Left (RTL)</option>
                            </select>
                        </div>

                        {/* Currency Symbol */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Currency Symbol</label>
                            <input
                                name="currencySymbol"
                                defaultValue={initialData?.currencySymbol || '$'}
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Date Format */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Date Format</label>
                            <select
                                name="dateFormat"
                                defaultValue={initialData?.dateFormat || 'DD-MM-YYYY'}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            >
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Social Network Hub</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Facebook', key: 'facebookUrl' },
                            { label: 'Twitter', key: 'twitterUrl' },
                            { label: 'YouTube', key: 'youtubeUrl' },
                            { label: 'Instagram', key: 'instagramUrl' },
                            { label: 'LinkedIn', key: 'linkedinUrl' },
                            { label: 'WhatsApp', key: 'whatsappUrl' }
                        ].map((platform) => (
                            <div key={platform.key} className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{platform.label}</label>
                                <input
                                    name={platform.key}
                                    defaultValue={initialData?.[platform.key] || ''}
                                    placeholder={`https://www.${platform.label.toLowerCase()}.com/`}
                                    type="url"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Telemetry & Tracking */}
                <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Telemetry & Tracking</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Analytics Source Injection (Header Scripts)</label>
                            <textarea
                                name="headerScripts"
                                defaultValue={initialData?.headerScripts || ''}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="<script>...</script>"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Recaptcha Site Key</label>
                                <input
                                    name="recaptchaKey"
                                    defaultValue={initialData?.recaptchaKey || ''}
                                    type="text"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Recaptcha Secret Key</label>
                                <input
                                    name="recaptchaSecret"
                                    defaultValue={initialData?.recaptchaSecret || ''}
                                    type="password"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <button
                    type="button"
                    onClick={scrollToTop}
                    className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-full shadow-lg transition-transform hover:-translate-y-1"
                >
                    <ArrowUp size={20} />
                </button>
            </div>

            <div className="flex flex-col items-start gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    PROPAGATE CHANGES TO PRODUCTION INSTANTLY.
                </p>
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Commit Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
