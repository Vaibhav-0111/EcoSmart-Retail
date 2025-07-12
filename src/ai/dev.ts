import { config } from 'dotenv';
config();

import '@/ai/flows/learn-user-preferences.ts';
import '@/ai/flows/provide-personalized-product-suggestions.ts';
import '@/ai/flows/recommend-returned-item-action.ts';