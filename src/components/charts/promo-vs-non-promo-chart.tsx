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
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";

const chartConfig = {
  promoSales: {
    label: "Promo Weeks",
    color: "hsl(var(--chart-1))",
  },
  nonPromoSales: {
    label: "Non-Promo Weeks",
    color: "hsl(var(--chart-2))",
  },
};

export default function PromoVsNonPromoChart({
  data,
}: {
  data: MarketingData[];
}) {
  const promoWeeks = data.filter((d) => d.promo_flag);
  const nonPromoWeeks = data.filter((d) => !d.promo_flag);

  const avgPromoSales =
    promoWeeks.length > 0
      ? promoWeeks.reduce((sum, d) => sum + d.sales, 0) / promoWeeks.length
      : 0;
  const avgNonPromoSales =
    nonPromoWeeks.length > 0
      ? nonPromoWeeks.reduce((sum, d) => sum + d.sales, 0) /
        nonPromoWeeks.length
      : 0;

  const chartData = [
    {
      name: "Average Weekly Sales",
      promoSales: avgPromoSales,
      nonPromoSales: avgNonPromoSales,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo vs. Non-Promo Sales</CardTitle>
        <CardDescription>
          Comparison of average weekly sales volume on promotional vs.
          non-promotional weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatNumber(value as number)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend />
            <Bar
              dataKey="nonPromoSales"
              fill="var(--color-nonPromoSales)"
              radius={4}
            />
            <Bar
              dataKey="promoSales"
              fill="var(--color-promoSales)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
