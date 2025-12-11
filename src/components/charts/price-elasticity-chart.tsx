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
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/calculations";

const chartConfig = {
  sales: {
    label: "Sales Volume",
    color: "hsl(var(--chart-3))",
  },
};

export default function PriceElasticityChart({
  data,
  priceElasticity
}: {
  data: MarketingData[];
  priceElasticity: number;
}) {
  const chartData = [...data]
    .sort((a, b) => a.price - b.price)
    .map((d) => ({
      price: d.price,
      sales: d.sales,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Elasticity Curve (Demand Curve)</CardTitle>
        <CardDescription>
          Shows how demand (sales volume) changes with price. Current elasticity: {formatNumber(priceElasticity)}
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
              name="Price"
              domain={['dataMin', 'dataMax']}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <YAxis
              dataKey="sales"
              name="Sales"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatNumber(value as number)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
