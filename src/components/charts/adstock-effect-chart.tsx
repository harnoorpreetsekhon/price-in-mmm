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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const adstock = (spend: number[], decay: number): number[] => {
  const adstocked_spend: number[] = [];
  let last_adstock = 0;
  for (const s of spend) {
    last_adstock = s + decay * last_adstock;
    adstocked_spend.push(last_adstock);
  }
  return adstocked_spend;
};

const chartConfig = {
  spend: { label: "Actual Spend", color: "hsl(var(--chart-1))" },
  adstock: { label: "Adstocked Spend", color: "hsl(var(--chart-2))" },
};

export default function AdstockEffectChart({
  data,
}: {
  data: MarketingData[];
}) {
  const socialSpend = data.map((d) => d.marketing_spend_social);
  const adstockedSocial = adstock(socialSpend, 0.7);

  const chartData = data.map((d, i) => ({
    date: d.date,
    spend: d.marketing_spend_social,
    adstock: adstockedSocial[i],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adstock Effect (Social Channel)</CardTitle>
        <CardDescription>
          Lagging impact of advertising spend over time due to memory and
          carry-over effects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
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
            <Area
                dataKey="spend"
                type="natural"
                fill="var(--color-spend)"
                fillOpacity={0.4}
                stroke="var(--color-spend)"
                stackId="a"
            />
            <Area
                dataKey="adstock"
                type="natural"
                fill="var(--color-adstock)"
                fillOpacity={0.4}
                stroke="var(--color-adstock)"
                stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
