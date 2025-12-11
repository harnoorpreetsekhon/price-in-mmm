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
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
};

export default function PriceVsRevenueChart({
  data,
}: {
  data: MarketingData[];
}) {
  const chartData = data.map((d) => ({
    price: d.price,
    revenue: d.sales * d.price,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price vs. Revenue</CardTitle>
        <CardDescription>
          Scatter plot showing the relationship between weekly price and
          revenue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ScatterChart
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="price"
              type="number"
              name="Price"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <YAxis
              dataKey="revenue"
              type="number"
              name="Revenue"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <Scatter
              name="Weekly Data"
              data={chartData}
              fill="var(--color-revenue)" 
              opacity={0.6}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
