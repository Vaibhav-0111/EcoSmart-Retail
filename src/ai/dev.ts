import { config } from 'dotenv';
config();

import '@/ai/flows/learn-user-preferences.ts';
import '@/ai/flows/provide-personalized-product-suggestions.ts';
import '@/ai/flows/recommend-returned-item-action.ts';
import '@/ai/flows/identify-product-from-image.ts';
import '@/ai/flows/generate-sustainability-report.ts';
import '@/ai/flows/get-inventory-recommendations.ts';
import '@/ai/flows/diagnose-returned-item.ts';
