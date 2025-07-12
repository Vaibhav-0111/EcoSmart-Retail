'use server';

/**
 * @fileOverview A user preference learning AI agent.
 *
 * - learnUserPreferences - A function that handles the user preference learning process.
 * - LearnUserPreferencesInput - The input type for the learnUserPreferences function.
 * - LearnUserPreferencesOutput - The return type for the learnUserPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearnUserPreferencesInputSchema = z.object({
  browsingHistory: z.string().describe('The user browsing history.'),
  purchaseHistory: z.string().describe('The user purchase history.'),
});
export type LearnUserPreferencesInput = z.infer<typeof LearnUserPreferencesInputSchema>;

const LearnUserPreferencesOutputSchema = z.object({
  userPreferences: z.string().describe('The learned user preferences.'),
});
export type LearnUserPreferencesOutput = z.infer<typeof LearnUserPreferencesOutputSchema>;

export async function learnUserPreferences(input: LearnUserPreferencesInput): Promise<LearnUserPreferencesOutput> {
  return learnUserPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learnUserPreferencesPrompt',
  input: {schema: LearnUserPreferencesInputSchema},
  output: {schema: LearnUserPreferencesOutputSchema},
  prompt: `You are an AI that learns user preferences based on their browsing and purchase history.

  Browsing History: {{{browsingHistory}}}
  Purchase History: {{{purchaseHistory}}}

  Based on the provided browsing and purchase history, determine the user's preferences.
  What kind of products are they interested in? What are their favorite brands?
  What are their price ranges?
  Return the preferences in a single paragraph.
  `,
});

const learnUserPreferencesFlow = ai.defineFlow(
  {
    name: 'learnUserPreferencesFlow',
    inputSchema: LearnUserPreferencesInputSchema,
    outputSchema: LearnUserPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
