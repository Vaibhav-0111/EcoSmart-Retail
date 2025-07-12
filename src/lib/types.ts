export type ReturnedItem = {
  id: string;
  name: string;
  category: "electronics" | "clothing" | "home goods" | "toys";
  condition: "new" | "used" | "damaged";
  returnReason: string;
};
