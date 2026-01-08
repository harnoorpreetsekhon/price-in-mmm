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
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import type { MarketingData } from "@/lib/types";

const chartConfig = {
  roas: {
    label: "ROAS",
    color: "hsl(var(--chart-2))",
  },
};

export default function ChannelRoasChart({ data }: { data: MarketingData[] }) {
  const totalSpend = {
    search: data.reduce((a, b) => a + b.marketing_spend_search, 0),
    social: data.reduce((a, b) => a + b.marketing_spend_social, 0),
    display: data.reduce((a, b) => a + b.marketing_spend_display, 0),
    video: data.reduce((a, b) => a + b.marketing_spend_video, 0),
    affiliate: data.reduce((a, b) => a + b.marketing_spend_affiliate, 0),
    ooh: data.reduce((a, b) => a + b.marketing_spend_ooh, 0),
    trade: data.reduce((a, b) => a + b.marketing_spend_trade, 0),
  };
  const totalContribution = {
    search: data.reduce((a, b) => a + b.media_contribution_search, 0),
    social: data.reduce((a, b) => a + b.media_contribution_social, 0),
    display: data.reduce((a, b) => a + b.media_contribution_display, 0),
    video: data.reduce((a, b) => a + b.media_contribution_video, 0),
    affiliate: data.reduce((a, b) => a + b.media_contribution_affiliate, 0),
    ooh: data.reduce((a, b) => a + b.media_contribution_ooh, 0),
    trade: data.reduce((a, b) => a + b.media_contribution_trade, 0),
  };

  const roasData = [
    {
      channel: "Search",
      roas: totalSpend.search > 0 ? totalContribution.search / totalSpend.search : 0,
    },
    {
      channel: "Social",
      roas: totalSpend.social > 0 ? totalContribution.social / totalSpend.social : 0,
    },
    {
      channel: "Display",
      roas: totalSpend.display > 0 ? totalContribution.display / totalSpend.display : 0,
    },
    {
      channel: "Video",
      roas: totalSpend.video > 0 ? totalContribution.video / totalSpend.video : 0,
    },
    {
      channel: "Affiliate",
      roas: totalSpend.affiliate > 0 ? totalContribution.affiliate / totalSpend.affiliate : 0,
    },
     {
      channel: "OOH",
      roas: totalSpend.ooh > 0 ? totalContribution.ooh / totalSpend.ooh : 0,
    },
     {
      channel: "Trade",
      roas: totalSpend.trade > 0 ? totalContribution.trade / totalSpend.trade : 0,
    },
  ].sort((a,b) => b.roas - a.roas);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel ROAS Comparison</CardTitle>
        <CardDescription>
          Return on Ad Spend for each marketing channel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={roasData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <XAxis
              dataKey="channel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}x`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="roas" fill="var(--color-roas)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
