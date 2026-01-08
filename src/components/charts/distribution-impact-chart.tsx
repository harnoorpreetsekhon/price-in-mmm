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
import { formatNumber } from "@/lib/calculations";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-4))",
  },
};

export default function DistributionImpactChart({
  data,
}: {
  data: MarketingData[];
}) {
  const chartData = data.map((d) => ({
    distribution: d.distribution_score,
    sales: d.sales,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution Impact on Sales</CardTitle>
        <CardDescription>
          Shows the relationship between distribution score and weekly sales volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ScatterChart
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="distribution"
              type="number"
              name="Distribution Score"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <YAxis
              dataKey="sales"
              type="number"
              name="Sales"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatNumber(value as number)}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <Scatter
              name="Weekly Sales"
              data={chartData}
              fill="var(--color-sales)" 
              opacity={0.6}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
