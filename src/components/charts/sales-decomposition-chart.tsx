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
  ChartLegendContent
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";


const chartConfig = {
  baseline_sales: { label: "Baseline", color: "hsl(var(--chart-1))" },
  media_contribution_total: { label: "Media", color: "hsl(var(--chart-2))" },
  price_effect: { label: "Price", color: "hsl(var(--chart-3))" },
  promo_effect: { label: "Promo", color: "hsl(var(--chart-4))" },
  competition_effect: { label: "Competition", color: "hsl(var(--chart-5))" },
};

export default function SalesDecompositionChart({
  data,
}: {
  data: MarketingData[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Decomposition</CardTitle>
        <CardDescription>
          Shows how different factors contribute to total predicted sales over
          time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.entries(chartConfig).map(([key, config]) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={config.color}
                fillOpacity={0.8}
                stroke={config.color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
