'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized product suggestions.
 *
 * - providePersonalizedProductSuggestions - A function that takes user preferences and returns personalized product suggestions.
 * - PersonalizedProductSuggestionsInput - The input type for the providePersonalizedProductSuggestions function.
 * - PersonalizedProductSuggestionsOutput - The return type for the providePersonalizedProductSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductSuggestionsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('A description of the user preferences and shopping habits.'),
  recentPurchases: z
    .string()
    .optional()
    .describe('A list of recent purchases made by the user.'),
  query: z
    .string()
    .optional()
    .describe(
      'The current search query of the user, if any. This can be used to further refine the product suggestions.'
    ),
});
export type PersonalizedProductSuggestionsInput = z.infer<typeof PersonalizedProductSuggestionsInputSchema>;

const PersonalizedProductSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of personalized product suggestions.'),
});
export type PersonalizedProductSuggestionsOutput = z.infer<typeof PersonalizedProductSuggestionsOutputSchema>;

export async function providePersonalizedProductSuggestions(
  input: PersonalizedProductSuggestionsInput
): Promise<PersonalizedProductSuggestionsOutput> {
  return providePersonalizedProductSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductSuggestionsPrompt',
  input: {schema: PersonalizedProductSuggestionsInputSchema},
  output: {schema: PersonalizedProductSuggestionsOutputSchema},
  prompt: `You are an AI shopping assistant designed to provide personalized product suggestions to users.

  Based on the user's preferences and shopping habits, provide a list of product suggestions that are relevant to them.
  Consider their recent purchases and current search query (if available) to further refine the suggestions.

  User Preferences: {{{userPreferences}}}
  Recent Purchases: {{{recentPurchases}}}
  Current Search Query: {{{query}}}

  Suggestions:`,
});

const providePersonalizedProductSuggestionsFlow = ai.defineFlow(
  {
    name: 'providePersonalizedProductSuggestionsFlow',
    inputSchema: PersonalizedProductSuggestionsInputSchema,
    outputSchema: PersonalizedProductSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
