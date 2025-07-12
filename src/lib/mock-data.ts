import { ComponentType } from "react";
import { ReturnedItem } from "./types";
import { Leaf, Recycle, Droplets, Trees, Timer, TrendingUp, CircleDollarSign, CheckSquare } from "lucide-react";

export const mockReturnedItems: ReturnedItem[] = [
  {
    id: "R-1001",
    name: "Smart LED TV 55-inch",
    category: "electronics",
    condition: "used",
    returnReason: "Customer changed their mind.",
    value: 450,
  },
  {
    id: "R-1002",
    name: "Winter Jacket - Medium",
    category: "clothing",
    condition: "new",
    returnReason: "Incorrect size ordered.",
    value: 85,
  },
  {
    id: "R-1003",
    name: "Non-stick Frying Pan",
    category: "home goods",
    condition: "damaged",
    returnReason: "Item arrived with a dent.",
    value: 30,
  },
  {
    id: "R-1004",
    name: "Remote Control Car",
    category: "toys",
    condition: "used",
    returnReason: "Faulty remote control.",
    value: 45,
  },
    {
    id: "R-1005",
    name: "Wireless Headphones",
    category: "electronics",
    condition: "new",
    returnReason: "Unwanted gift.",
    value: 199,
  },
    {
    id: "R-1006",
    name: "Summer Dress - Small",
    category: "clothing",
    condition: "used",
    returnReason: "Doesn't fit as expected.",
    value: 60,
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


export const analyticsMetrics = [
    {
        icon: Timer,
        title: "Avg. Processing Time",
        value: "2.1h",
        description: "From receipt to final action",
    },
    {
        icon: TrendingUp,
        title: "Success Rate",
        value: "94.5%",
        description: "Items successfully processed",
    },
    {
        icon: CircleDollarSign,
        title: "Revenue Recovered",
        value: "$18,230",
        description: "From reselling & recycling",
    },
    {
        icon: CheckSquare,
        title: "Total Items Processed",
        value: "1,289",
        description: "This month",
    },
];

export const revenueByActionData = [
  { month: "Jan", resell: 9000, repair: 2000, recycle: 1000 },
  { month: "Feb", resell: 11000, repair: 2500, recycle: 1200 },
  { month: "Mar", resell: 13000, repair: 2200, recycle: 1500 },
  { month: "Apr", resell: 12500, repair: 3000, recycle: 1800 },
  { month: "May", resell: 14000, repair: 3200, recycle: 2000 },
  { month: "Jun", resell: 15500, repair: 3500, recycle: 2100 },
];

export const revenueByActionChartConfig = {
  resell: { label: "Resell", color: "hsl(var(--chart-1))" },
  repair: { label: "Repair", color: "hsl(var(--chart-2))" },
  recycle: { label: "Recycle", color: "hsl(var(--chart-5))" },
} satisfies import("@/components/ui/chart").ChartConfig;

export const processingTimeData = [
    { month: "Jan", time: 3.5 },
    { month: "Feb", time: 3.2 },
    { month: "Mar", time: 2.8 },
    { month: "Apr", time: 2.5 },
    { month: "May", time: 2.2 },
    { month: "Jun", time: 2.1 },
];

export const processingTimeChartConfig = {
    time: {
        label: "Avg Time (hours)",
        color: "hsl(var(--chart-1))",
    },
} satisfies import("@/components/ui/chart").ChartConfig;


export const inventoryRecommendations = [
    {
        id: "REC-001",
        type: "inventory",
        title: "Overstock Alert: Winter Jackets",
        description: "High return rate and low recent sales for Winter Jackets. Recommend a promotional sale to clear stock.",
        impact: "High",
        confidence: 95
    },
    {
        id: "REC-002",
        type: "supply chain",
        title: "Supplier Delay Detected",
        description: "Potential 3-day delay from supplier 'Global Electronics'. Suggest sourcing Smart TVs from alternate supplier 'TechForward'.",
        impact: "Medium",
        confidence: 88
    },
    {
        id: "REC-003",
        type: "inventory",
        title: "Low Stock: Wireless Headphones",
        description: "Sales velocity is high, and current stock is projected to run out in 5 days. Recommend placing a new order.",
        impact: "High",
        confidence: 98
    },
     {
        id: "REC-004",
        type: "supply chain",
        title: "Optimize Shipping Route",
        description: "New shipping route available that could reduce delivery time for home goods by 12%.",
        impact: "Low",
        confidence: 92
    },
];
