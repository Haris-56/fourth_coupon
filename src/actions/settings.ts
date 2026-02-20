
'use server';

import Settings from '@/models/Settings';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';

const SettingsSchema = z.object({
    maintenanceMode: z.boolean().optional(),
    languageDirection: z.enum(['LTR', 'RTL']).optional(),
    currencySymbol: z.string().optional(),
    dateFormat: z.string().optional(),
    facebookUrl: z.string().optional().or(z.literal('')),
    twitterUrl: z.string().optional().or(z.literal('')),
    youtubeUrl: z.string().optional().or(z.literal('')),
    instagramUrl: z.string().optional().or(z.literal('')),
    linkedinUrl: z.string().optional().or(z.literal('')),
    whatsappUrl: z.string().optional().or(z.literal('')),
    headerScripts: z.string().optional().or(z.literal('')),
    recaptchaKey: z.string().optional().or(z.literal('')),
    recaptchaSecret: z.string().optional().or(z.literal('')),
});

export async function updateSettings(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        const validatedFields = SettingsSchema.safeParse({
            maintenanceMode: formData.get('maintenanceMode') === 'enabled',
            languageDirection: formData.get('languageDirection'),
            currencySymbol: formData.get('currencySymbol'),
            dateFormat: formData.get('dateFormat'),
            facebookUrl: formData.get('facebookUrl'),
            twitterUrl: formData.get('twitterUrl'),
            youtubeUrl: formData.get('youtubeUrl'),
            instagramUrl: formData.get('instagramUrl'),
            linkedinUrl: formData.get('linkedinUrl'),
            whatsappUrl: formData.get('whatsappUrl'),
            headerScripts: formData.get('headerScripts'),
            recaptchaKey: formData.get('recaptchaKey'),
            recaptchaSecret: formData.get('recaptchaSecret'),
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors, success: false };
        }

        const data = validatedFields.data;
        await connectToDatabase();

        let settings = await Settings.findOne();
        if (settings) {
            Object.assign(settings, data);
            await settings.save();
        } else {
            settings = await Settings.create(data);
        }

        revalidatePath('/admin/settings');
        return { message: 'Settings updated successfully', success: true };
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to update settings', success: false };
    }
}
