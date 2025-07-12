import { ReturnedItem } from "./types";

export const mockReturnedItems: ReturnedItem[] = [
  {
    id: "R-1001",
    name: "Smart LED TV 55-inch",
    category: "electronics",
    condition: "used",
    returnReason: "Customer changed their mind.",
  },
  {
    id: "R-1002",
    name: "Winter Jacket - Medium",
    category: "clothing",
    condition: "new",
    returnReason: "Incorrect size ordered.",
  },
  {
    id: "R-1003",
    name: "Non-stick Frying Pan",
    category: "home goods",
    condition: "damaged",
    returnReason: "Item arrived with a dent.",
  },
  {
    id: "R-1004",
    name: "Remote Control Car",
    category: "toys",
    condition: "used",
    returnReason: "Faulty remote control.",
  },
    {
    id: "R-1005",
    name: "Wireless Headphones",
    category: "electronics",
    condition: "new",
    returnReason: "Unwanted gift.",
  },
    {
    id: "R-1006",
    name: "Summer Dress - Small",
    category: "clothing",
    condition: "used",
    returnReason: "Doesn't fit as expected.",
  },
];


export const sustainabilityMetrics = [
  { action: "Resell", value: 45, fill: "var(--color-resell)" },
  { action: "Repair", value: 20, fill: "var(--color-repair)" },
  { action: "Reuse", value: 15, fill: "var(--color-reuse)" },
  { action: "Recycle", value: 20, fill: "var(--color-recycle)" },
];

export const sustainabilityChartConfig = {
  value: {
    label: "Items",
  },
  resell: {
    label: "Resell",
    color: "hsl(var(--chart-1))",
  },
  repair: {
    label: "Repair",
    color: "hsl(var(--chart-2))",
  },
  reuse: {
    label: "Reuse",
    color: "hsl(var(--chart-4))",
  },
  recycle: {
    label: "Recycle",
    color: "hsl(var(--chart-5))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;
