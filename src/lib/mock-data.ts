import { ReturnedItem } from "./types";
import { Leaf, Recycle, Droplets, Trees } from "lucide-react";

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

export const sustainabilityImpactMetrics = [
    {
        icon: Leaf,
        title: "CO2 Emissions Saved",
        value: "1,250 kg",
        description: "Equivalent to planting 20 trees",
        trend: "+15% this month",
    },
    {
        icon: Recycle,
        title: "Waste Diverted from Landfill",
        value: "5,800 kg",
        description: "Total items recycled or reused",
        trend: "+12% this month",
    },
    {
        icon: Droplets,
        title: "Water Saved",
        value: "450,000 L",
        description: "Through recycling and reuse programs",
        trend: "+8% this month",
    },
    {
        icon: Trees,
        title: "Trees Saved",
        value: "350",
        description: "By using recycled packaging",
        trend: "+10% this month",
    },
];


export const co2SavedData = [
  { month: "January", co2: 186 },
  { month: "February", co2: 305 },
  { month: "March", co2: 437 },
  { month: "April", co2: 573 },
  { month: "May", co2: 609 },
  { month: "June", co2: 789 },
  { month: "July", co2: 921 },
  { month: "August", co2: 1050 },
  { month: "September", co2: 1180 },
  { month: "October", co2: 1250 },
];

export const co2SavedChartConfig = {
  co2: {
    label: "CO2 Saved (kg)",
    color: "hsl(var(--chart-2))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;
