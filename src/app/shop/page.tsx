// src/app/shop/page.tsx
import { PersonalShopperChat } from "@/components/personal-shopper-chat";
import { Card, CardContent } from "@/components/ui/card";

export default function ShopPage() {
  return (
    <div className="flex justify-center items-start p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-3xl h-[calc(100vh-120px)] flex flex-col">
        <CardContent className="p-0 flex-1">
          <PersonalShopperChat />
        </CardContent>
      </Card>
    </div>
  );
}
