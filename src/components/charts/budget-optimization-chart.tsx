"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { formatCurrency } from "@/lib/calculations";

const channels = [
  { key: "search", name: "Search" },
  { key: "social", name: "Social" },
  { key: "display", name: "Display" },
  { key: "video", name: "Video" },
  { key: "affiliate", name: "Affiliate" },
];

// Simplified optimization logic. A real model would be much more complex.
const getOptimalBudgets = (currentSpend: Record<string, number>) => {
  // Mock optimization: Reallocate budget slightly towards channels with lower spend
  const totalSpend = Object.values(currentSpend).reduce((a, b) => a + b, 0);
  const avgSpend = totalSpend / channels.length;
  
  const optimal = {
    search: avgSpend * 1.2,
    social: avgSpend * 1.5,
    display: avgSpend * 0.8,
    video: avgSpend * 1.3,
    affiliate: avgSpend * 0.7
  };

  // Normalize to maintain total spend
  const optimalTotal = Object.values(optimal).reduce((a, b) => a + b, 0);
  const normalizationFactor = totalSpend / optimalTotal;
  
  return {
    search: optimal.search * normalizationFactor,
    social: optimal.social * normalizationFactor,
    display: optimal.display * normalizationFactor,
    video: optimal.video * normalizationFactor,
    affiliate: optimal.affiliate * normalizationFactor,
  };
};

const chartConfig = {
  current: {
    label: "Current Spend",
    color: "hsl(var(--chart-2))",
  },
  optimal: {
    label: "Optimal Spend",
    color: "hsl(var(--chart-1))",
  },
};

export default function BudgetOptimizationChart({ data }: { data: any[] }) {
  const currentSpend = {
    search: data.reduce((a, b) => a + b.marketing_spend_search, 0),
    social: data.reduce((a, b) => a + b.marketing_spend_social, 0),
    display: data.reduce((a, b) => a + b.marketing_spend_display, 0),
    video: data.reduce((a, b) => a + b.marketing_spend_video, 0),
    affiliate: data.reduce((a, b) => a + b.marketing_spend_affiliate, 0),
  };
  
  const optimalSpend = getOptimalBudgets(currentSpend);

  const chartData = channels.map(channel => ({
      name: channel.name,
      current: currentSpend[channel.key as keyof typeof currentSpend],
      optimal: optimalSpend[channel.key as keyof typeof optimalSpend],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Allocation: Current vs. Optimal</CardTitle>
        <CardDescription>
          Compares current budget allocation with model-recommended optimal allocation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<ChartTooltipContent />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="current" fill="var(--color-current)" radius={4}>
                <LabelList dataKey="current" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => formatCurrency(value)} />
            </Bar>
            <Bar dataKey="optimal" fill="var(--color-optimal)" radius={4}>
                <LabelList dataKey="optimal" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={(value: number) => formatCurrency(value)} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
