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
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import type { MarketingData } from "@/lib/types";
import { formatCurrency } from "@/lib/calculations";

const chartConfig = {
  contribution: {
    label: "Contribution",
    color: "hsl(var(--chart-1))",
  },
};

export default function ChannelContributionChart({
  data,
}: {
  data: MarketingData[];
}) {
  const channelData = [
    {
      channel: "Search",
      contribution: data.reduce((a, b) => a + b.media_contribution_search, 0),
    },
    {
      channel: "Social",
      contribution: data.reduce((a, b) => a + b.media_contribution_social, 0),
    },
    {
      channel: "Display",
      contribution: data.reduce((a, b) => a + b.media_contribution_display, 0),
    },
    {
      channel: "Video",
      contribution: data.reduce((a, b) => a + b.media_contribution_video, 0),
    },
    {
      channel: "Affiliate",
      contribution: data.reduce((a, b) => a + b.media_contribution_affiliate, 0),
    },
    {
        channel: "OOH",
        contribution: data.reduce((a, b) => a + b.media_contribution_ooh, 0),
    },
    {
        channel: "Trade",
        contribution: data.reduce((a, b) => a + b.media_contribution_trade, 0),
    }
  ].sort((a,b) => b.contribution - a.contribution);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Contribution to Sales</CardTitle>
        <CardDescription>
          Total incremental sales driven by each marketing channel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={channelData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <YAxis
              dataKey="channel"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="contribution"
              fill="var(--color-contribution)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
