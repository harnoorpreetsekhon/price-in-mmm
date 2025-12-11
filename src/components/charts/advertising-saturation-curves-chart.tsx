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
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const saturation = (s: number, alpha: number, k: number): number => {
    return (s ** alpha) / (s ** alpha + k ** alpha);
};

const channels = {
    search: { alpha: 0.8, k: 5000, color: "hsl(var(--chart-1))" },
    social: { alpha: 0.9, k: 8000, color: "hsl(var(--chart-2))" },
    video: { alpha: 0.85, k: 7000, color: "hsl(var(--chart-3))" },
    display: { alpha: 0.7, k: 4000, color: "hsl(var(--chart-4))" },
    affiliate: { alpha: 0.75, k: 3000, color: "hsl(var(--chart-5))" },
};

const chartData = Array.from({ length: 101 }, (_, i) => {
    const spend = i * 150; // from 0 to 15000
    const point: {[key: string]: number} = { spend };
    for (const [key, params] of Object.entries(channels)) {
        point[key] = saturation(spend, params.alpha, params.k);
    }
    return point;
});

const chartConfig = {
    search: { label: "Search", color: channels.search.color },
    social: { label: "Social", color: channels.social.color },
    video: { label: "Video", color: channels.video.color },
    display: { label: "Display", color: channels.display.color },
    affiliate: { label: "Affiliate", color: channels.affiliate.color },
};


export default function AdvertisingSaturationCurvesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertising Saturation Curves</CardTitle>
        <CardDescription>
          Shows the diminishing returns on ad spend for each channel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="spend"
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.entries(chartConfig).map(([key, config]) => (
                <Line
                    key={key}
                    dataKey={key}
                    type="natural"
                    stroke={config.color}
                    strokeWidth={2}
                    dot={false}
                />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
