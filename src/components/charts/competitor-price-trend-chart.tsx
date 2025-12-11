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
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const chartConfig = {
  ownPrice: {
    label: "Our Price",
    color: "hsl(var(--chart-1))",
  },
  competitorPrice: {
    label: "Competitor Price",
    color: "hsl(var(--chart-2))",
  },
};

export default function CompetitorPriceTrendChart({
  data,
}: {
  data: MarketingData[];
}) {
  const chartData = data.map((d) => ({
    date: d.date,
    ownPrice: d.price,
    competitorPrice: d.competitor_price,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Price vs. Own Price</CardTitle>
        <CardDescription>
          Tracking our price against the competitor's over the last two years.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
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
            <Line
              dataKey="ownPrice"
              type="monotone"
              stroke="var(--color-ownPrice)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="competitorPrice"
              type="monotone"
              stroke="var(--color-competitorPrice)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
