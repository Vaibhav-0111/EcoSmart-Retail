// src/ai/flows/personal-shopper.ts
'use server';
/**
 * @fileOverview A conversational AI flow that acts as a personal shopper.
 *
 * - personalShopper - A function that handles the conversational shopping experience.
 * - PersonalShopperInput - The input type for the personalShopper function.
 * - PersonalShopperOutput - The return type for the personalShopper function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- MOCK PRODUCT DATABASE ---
const mockProductCatalog = [
  { id: 'prod-001', name: 'Premium Leather Backpack', category: 'accessories', price: 189.99, description: 'A stylish and durable backpack for work and travel, made from genuine leather with multiple compartments.', keywords: ['work', 'travel', 'professional', 'bag'] },
  { id: 'prod-002', name: 'Gourmet Chef\'s Knife', category: 'home goods', price: 129.50, description: 'A high-carbon stainless steel chef\'s knife, perfect for the home cook or professional chef.', keywords: ['cooking', 'kitchen', 'gift', 'dad'] },
  { id: 'prod-003', name: 'Waterproof Hiking Jacket', category: 'clothing', price: 249.00, description: 'A lightweight, breathable, and fully waterproof jacket designed for serious hikers.', keywords: ['outdoors', 'hiking', 'warm', 'jacket'] },
  { id: 'prod-004', name: 'Noise-Cancelling Headphones', category: 'electronics', price: 349.99, description: 'Immerse yourself in sound with these top-of-the-line noise-cancelling headphones.', keywords: ['tech', 'music', 'gift', 'travel'] },
  { id: 'prod-005', name: 'Organic Cotton Throw Blanket', category: 'home goods', price: 79.99, description: 'A soft and cozy throw blanket made from 100% organic cotton, perfect for the living room.', keywords: ['cozy', 'home', 'gift'] },
  { id: 'prod-006', name: 'Smart Fitness Tracker', category: 'electronics', price: 149.00, description: 'Track your steps, heart rate, and workouts with this sleek and modern fitness tracker.', keywords: ['fitness', 'health', 'tech', 'gadget'] },
  { id: 'prod-007', name: 'Italian Espresso Machine', category: 'home goods', price: 499.00, description: 'Become a home barista with this semi-automatic Italian espresso machine.', keywords: ['coffee', 'kitchen', 'luxury', 'gift'] },
];

const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    imageUrl: z.string().url().describe("A placeholder image URL for the product."),
});

const searchProductCatalog = ai.defineTool(
    {
        name: 'searchProductCatalog',
        description: 'Searches the product catalog to find items matching the user\'s request.',
        inputSchema: z.object({
            query: z.string().describe('The user\'s search query or description of what they are looking for.'),
            category: z.string().optional().describe('A specific product category to narrow the search.'),
            maxPrice: z.number().optional().describe('The maximum price for the product.'),
            minPrice: z.number().optional().describe('The minimum price for the product.'),
        }),
        outputSchema: z.object({
            products: z.array(ProductSchema).describe("An array of products that match the search criteria."),
        }),
    },
    async (input) => {
        console.log(`Simulating product search for: ${JSON.stringify(input)}`);
        const query = input.query.toLowerCase();
        const keywords = query.split(/\s+/);

        const filteredProducts = mockProductCatalog.filter(product => {
            const matchesCategory = !input.category || product.category === input.category;
            const matchesMaxPrice = !input.maxPrice || product.price <= input.maxPrice;
            const matchesMinPrice = !input.minPrice || product.price >= input.minPrice;
            const matchesKeywords = keywords.some(kw => product.name.toLowerCase().includes(kw) || product.description.toLowerCase().includes(kw) || product.keywords.includes(kw));

            return matchesCategory && matchesMaxPrice && matchesMinPrice && matchesKeywords;
        });

        const productsWithImages = filteredProducts.map(p => ({...p, imageUrl: `https://placehold.co/600x400.png`}));

        return { products: productsWithImages };
    }
);

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model', 'tool']),
  content: z.string(),
});

const PersonalShopperInputSchema = z.object({
  chatHistory: z.array(ChatMessageSchema).describe('The history of the conversation so far.'),
});
export type PersonalShopperInput = z.infer<typeof PersonalShopperInputSchema>;

const PersonalShopperOutputSchema = z.object({
  response: z.string().describe('The AI\'s next response in the conversation.'),
  recommendedProducts: z.array(ProductSchema).optional().describe('A list of products the AI recommends based on the conversation.'),
});
export type PersonalShopperOutput = z.infer<typeof PersonalShopperOutputSchema>;


export async function personalShopper(input: PersonalShopperInput): Promise<PersonalShopperOutput> {
  return personalShopperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalShopperPrompt',
  input: {schema: PersonalShopperInputSchema},
  output: {schema: PersonalShopperOutputSchema},
  tools: [searchProductCatalog],
  prompt: `You are a friendly and expert Personal Shopper AI. Your goal is to help users find the perfect product by having a natural, helpful conversation.

- Start the conversation by greeting the user and asking how you can help them today.
- Ask clarifying questions to understand their needs, preferences, style, and budget. Be proactive. If they say "a gift for my dad", ask what he likes.
- Once you have enough information, use the 'searchProductCatalog' tool to find suitable products. You can call the tool multiple times if needed.
- When you find good products, present them to the user in your 'response' message. Mention the products by name and give a brief, engaging summary of why you think they're a good fit.
- Set the 'recommendedProducts' field in your output with the full details of the products you are showing the user.
- If the tool returns no products, inform the user and try to refine the search by asking more questions.
- Maintain a friendly, conversational, and helpful tone throughout.

Here is the conversation history:
{{#each chatHistory}}
  {{role}}: {{content}}
{{/each}}
  `,
});


const personalShopperFlow = ai.defineFlow(
  {
    name: 'personalShopperFlow',
    inputSchema: PersonalShopperInputSchema,
    outputSchema: PersonalShopperOutputSchema,
  },
  async (input) => {
    // If there's no history, start the conversation.
    if (input.chatHistory.length === 0) {
      return {
        response: "Hello! I'm your AI Personal Shopper. What are you looking for today?",
      };
    }

    const { output } = await prompt(input);

    // If the model recommends products, make sure they are attached to the output.
    const toolOutputs = input.chatHistory.filter(m => m.role === 'tool');
    if (toolOutputs.length > 0) {
        try {
            // Find the most recent tool output that has products
            const lastToolOutputWithProducts = toolOutputs
                .reverse()
                .map(t => JSON.parse(t.content))
                .find(c => c.products && c.products.length > 0);
            
            if (lastToolOutputWithProducts) {
                // Check if the AI's text response mentions one of the products
                const mentionsProduct = lastToolOutputWithProducts.products.some((p: any) => output!.response.includes(p.name));
                if (mentionsProduct) {
                    output!.recommendedProducts = lastToolOutputWithProducts.products;
                }
            }
        } catch(e) {
            console.error("Could not parse tool output", e);
        }
    }
    
    return output!;
  }
);
