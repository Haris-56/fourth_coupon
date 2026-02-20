
import SettingsForm from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/settings';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            <SettingsForm initialData={settings} />
        </div>
    );
}
