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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
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

  const eventDate = data.length > 52 ? data[data.length - 52].date : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Price vs. Own Price</CardTitle>
        <CardDescription>
          Tracking our price against the competitor's over the selected period.
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
            {eventDate && (
              <ReferenceLine 
                x={eventDate} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="3 3" 
                label={{ value: "Comp. Campaign", position: "insideTopLeft", fill: "hsl(var(--destructive))", fontSize: 10 }}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
