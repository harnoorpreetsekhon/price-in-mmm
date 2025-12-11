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
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const chartConfig = {
  revenue: {
    label: "Est. Revenue",
    color: "hsl(var(--chart-4))",
  },
};

export default function RevenueVsPriceChart({
  data,
  optimalPrice,
}: {
  data: MarketingData[];
  optimalPrice: number;
}) {
  const avgSales = data.reduce((s, d) => s + d.sales, 0) / data.length;
  const avgPrice = data.reduce((s, d) => s + d.price, 0) / data.length;
  const elasticity = -1.5; // Assume from kpi
  const b = -elasticity * (avgSales / avgPrice);
  const a = avgSales + b * avgPrice;

  const chartData = Array.from({ length: 20 }).map((_, i) => {
    const price = avgPrice * 0.7 + (i * (avgPrice * 0.6)) / 19;
    const sales = Math.max(0, a - b * price);
    return {
      price,
      revenue: sales * price,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs. Price Curve</CardTitle>
        <CardDescription>
          Estimated revenue at different price points. Optimal price for
          revenue: {formatCurrency(optimalPrice)}
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
              dataKey="price"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="revenue"
              type="natural"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              x={optimalPrice}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{
                value: "Optimal",
                position: "insideTopRight",
                fill: "hsl(var(--primary))",
                fontSize: 12,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
