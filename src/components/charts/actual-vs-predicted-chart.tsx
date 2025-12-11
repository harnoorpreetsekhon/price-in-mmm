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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const chartConfig = {
  sales: {
    label: "Actual Sales",
    color: "hsl(var(--chart-1))",
  },
  predicted_sales: {
    label: "Predicted Sales",
    color: "hsl(var(--chart-2))",
  },
};

export default function ActualVsPredictedChart({
  data,
}: {
  data: MarketingData[];
}) {
  const chartData = data.map(d => ({
    date: d.date,
    sales: d.sales,
    predicted_sales: d.predicted_sales
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actual vs. Predicted Sales</CardTitle>
        <CardDescription>
          This chart compares actual sales figures against the model's
          predictions over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => formatCurrency(value as number)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="predicted_sales"
              type="monotone"
              stroke="var(--color-predicted_sales)"
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
