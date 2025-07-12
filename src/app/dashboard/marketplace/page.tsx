// src/app/dashboard/marketplace/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useReturns } from "@/hooks/use-returns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Tags, Store, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateResaleListingAction } from "@/app/actions";
import { Remarkable } from "remarkable";
import type { ReturnedItem } from "@/lib/types";

const md = new Remarkable();

interface Listing {
  title: string;
  description: string;
  suggestedPrice: number;
}

function ListingCard({ item }: { item: ReturnedItem }) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [listing, setListing] = useState<Listing | null>(null);

    const handleGenerateListing = async () => {
        setIsLoading(true);
        setListing(null);
        try {
            const result = await generateResaleListingAction({
                productName: item.name,
                category: item.category,
                condition: item.condition,
                value: item.value,
                returnReason: item.returnReason,
            });
            setListing(result);
            toast({
                title: "Listing Generated!",
                description: "AI has created a sales listing for this item.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to generate AI listing.",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>
                    <span className="capitalize">{item.category}</span> - Original Value: ${item.value.toFixed(2)}
                </CardDescription>
                 <Badge variant="secondary" className="capitalize w-min">{item.condition}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-muted-foreground">AI is writing a listing...</p>
                    </div>
                )}
                {listing && (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-primary">{listing.title}</h4>
                            <p className="text-2xl font-bold text-right">${listing.suggestedPrice.toFixed(2)}</p>
                        </div>
                        <div 
                            className="prose prose-sm dark:prose-invert text-muted-foreground bg-muted/50 p-3 rounded-md" 
                            dangerouslySetInnerHTML={{ __html: md.render(listing.description) }}
                        />
                    </div>
                )}
                 {!listing && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                        <FileText className="size-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Click below to generate a sales listing with AI.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGenerateListing} disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {listing ? 'Regenerate Listing' : 'Generate AI Listing'}
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function MarketplacePage() {
    const { items } = useReturns();
    const resellItems = useMemo(() => {
        return items.filter(item => item.recommendation === 'resell');
    }, [items]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Resell Marketplace</h1>
                    <p className="text-muted-foreground">
                        Manage and list returned items recommended for resale.
                    </p>
                </div>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <Tags className="size-6" />
                        </div>
                        <div>
                             <p className="text-sm text-muted-foreground">Items Ready for Resale</p>
                             <p className="text-3xl font-bold">{resellItems.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {resellItems.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resellItems.map(item => (
                        <ListingCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-lg">
                    <Store className="size-16 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">No Items for Resale</h2>
                    <p className="mt-2 text-muted-foreground">
                        Items with a "resell" recommendation from the Returns Management page will appear here.
                    </p>
                </div>
            )}
        </div>
    );
}