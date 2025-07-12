export type ReturnedItem = {
  id: string;
  name: string;
  category: "electronics" | "clothing" | "home goods" | "toys" | "other";
  condition: "new" | "used" | "damaged";
  returnReason: string;
  value: number;
};
