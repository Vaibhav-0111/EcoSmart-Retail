// src/ai/flows/diagnose-returned-item.ts
'use server';
/**
 * @fileOverview A conversational AI flow to diagnose a returned item and suggest an action.
 *
 * - diagnoseReturnedItem - A function that handles the conversational diagnosis.
 * - DiagnoseReturnedItemInput - The input type for the diagnoseReturnedItem function.
 * - DiagnoseReturnedItemOutput - The return type for the diagnoseReturnedItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const searchInternetForProductPrice = ai.defineTool(
    {
        name: 'searchInternetForProductPrice',
        description: 'Searches the internet to find the current market price of a product.',
        inputSchema: z.object({
            productName: z.string().describe('The name of the product to search for.'),
        }),
        outputSchema: z.object({
            found: z.boolean(),
            estimatedPrice: z.number().optional().describe('The estimated price of the product in USD.'),
        }),
    },
    async (input) => {
        // A real implementation would use a search API or web scraper.
        // For this demo, we'll simulate it with a plausible random price.
        console.log(`Simulating internet search for: ${input.productName}`);
        const price = Math.floor(Math.random() * (400 - 20 + 1)) + 20;
        return { found: true, estimatedPrice: price };
    }
);

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  content: z.string(),
});

const DiagnoseReturnedItemInputSchema = z.object({
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type DiagnoseReturnedItemInput = z.infer<typeof DiagnoseReturnedItemInputSchema>;

const ItemDetailsSchema = z.object({
    name: z.string().describe('The name of the product.'),
    category: z.enum(['electronics', 'clothing', 'home goods', 'toys', 'other']).describe('The category of the product.'),
    condition: z.enum(['new', 'used', 'damaged']).describe('The condition of the product.'),
    returnReason: z.string().describe('The reason the customer returned the product.'),
    value: z.number().describe('The estimated retail value of the product in USD.'),
});

const DiagnoseReturnedItemOutputSchema = z.object({
  response: z.string().describe('The AI\'s next response or question in the conversation.'),
  isFinal: z.boolean().describe('Whether the AI has gathered all necessary information.'),
  itemDetails: ItemDetailsSchema.optional().describe('The final details of the item if isFinal is true.'),
  recommendedAction: z.enum(['reuse', 'repair', 'recycle', 'resell', 'landfill']).optional().describe('The recommended action for the item if isFinal is true.'),
  reasoning: z.string().optional().describe('The reasoning for the recommendation if isFinal is true.'),
});
export type DiagnoseReturnedItemOutput = z.infer<typeof DiagnoseReturnedItemOutputSchema>;

export async function diagnoseReturnedItem(input: DiagnoseReturnedItemInput): Promise<DiagnoseReturnedItemOutput> {
  return diagnoseReturnedItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseReturnedItemPrompt',
  input: {schema: DiagnoseReturnedItemInputSchema},
  output: {schema: DiagnoseReturnedItemOutputSchema},
  tools: [searchInternetForProductPrice],
  prompt: `You are an AI assistant helping a retail employee diagnose a returned item.
  Your goal is to gather the following information by asking questions:
  1. Product Name
  2. Product Category (must be one of: electronics, clothing, home goods, toys, other)
  3. Condition (must be one of: new, used, damaged)
  4. Return Reason

  When the user provides the product name, you MUST use the 'searchInternetForProductPrice' tool to find its estimated value.
  After using the tool, confirm the estimated value with the user and then ask for the remaining information (Category, Condition, Reason).

  Keep your questions friendly, concise, and focused on gathering one piece of information at a time.
  Start the conversation by asking for the product name if the history is empty.

  Once you have all 5 pieces of information (Name, Category, Value, Condition, Reason), set "isFinal" to true.
  Then, provide a final "recommendedAction" (reuse, repair, recycle, resell, or landfill) and a "reasoning" for your choice.
  Your final response message should be a summary of the item and your recommendation.

  Here is the conversation history:
  {{#each chatHistory}}
  {{#if (lookup . 'tool')}}
    Tool: {{content}}
    {{else}}
    {{role}}: {{content}}
    {{/if}}
  {{/each}}
  `,
});

const diagnoseReturnedItemFlow = ai.defineFlow(
  {
    name: 'diagnoseReturnedItemFlow',
    inputSchema: DiagnoseReturnedItemInputSchema,
    outputSchema: DiagnoseReturnedItemOutputSchema,
  },
  async (input) => {
    // If there's no history, start the conversation.
    if (input.chatHistory.length === 0) {
      return {
        response: "Hello! I can help you diagnose a returned item. What is the name of the product?",
        isFinal: false,
      };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
