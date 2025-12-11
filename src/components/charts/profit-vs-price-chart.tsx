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
  profit: {
    label: "Est. Profit",
    color: "hsl(var(--chart-5))",
  },
};

export default function ProfitVsPriceChart({
  data,
  optimalPrice,
}: {
  data: MarketingData[];
  optimalPrice: number;
}) {
  const avgSales = data.reduce((s, d) => s + d.sales, 0) / data.length;
  const avgPrice = data.reduce((s, d) => s + d.price, 0) / data.length;
  const avgCost = data.reduce((s, d) => s + d.cost_of_goods, 0) / data.length;
  const elasticity = -1.5;
  const b = -elasticity * (avgSales / avgPrice);
  const a = avgSales + b * avgPrice;

  const chartData = Array.from({ length: 20 }).map((_, i) => {
    const price = avgPrice * 0.7 + (i * (avgPrice * 0.6)) / 19;
    const sales = Math.max(0, a - b * price);
    return {
      price,
      profit: (price - avgCost) * sales,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit vs. Price Curve</CardTitle>
        <CardDescription>
          Estimated profit at different price points. Optimal price for
          profit: {formatCurrency(optimalPrice)}
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="profit"
              type="natural"
              stroke="var(--color-profit)"
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
