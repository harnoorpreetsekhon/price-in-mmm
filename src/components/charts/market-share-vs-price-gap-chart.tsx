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
import { formatPercentage, formatCurrency } from "@/lib/calculations";

const chartConfig = {
  marketShare: {
    label: "Market Share",
    color: "hsl(var(--chart-3))",
  },
};

export default function MarketShareVsPriceGapChart({
  data,
}: {
  data: MarketingData[];
}) {
  const chartData = data.map((d) => ({
    priceGap: d.price - d.competitor_price,
    marketShare: d.market_share,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Share vs. Price Gap</CardTitle>
        <CardDescription>
          Relationship between market share and the price difference to
          competitors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ScatterChart
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="priceGap"
              type="number"
              name="Price Gap"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(value) => formatCurrency(value as number)}
            />
            <YAxis
              dataKey="marketShare"
              type="number"
              name="Market Share"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0.1, 0.4]}
              tickFormatter={(value) => formatPercentage(value as number)}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={<ChartTooltipContent />}
            />
            <Scatter
              name="Weekly Data"
              data={chartData}
              fill="var(--color-marketShare)"
              opacity={0.6}
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
