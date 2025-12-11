import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingData } from "@/lib/types";
import ActualVsPredictedChart from "../charts/actual-vs-predicted-chart";
import SalesDecompositionChart from "../charts/sales-decomposition-chart";
import ChannelContributionChart from "../charts/channel-contribution-chart";
import ChannelRoasChart from "../charts/channel-roas-chart";

export default function CorePerformanceSection({
  data,
}: {
  data: MarketingData[];
}) {
  return (
    <div id="core-performance">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        MMM Core Performance
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ActualVsPredictedChart data={data} />
        <SalesDecompositionChart data={data} />
        <ChannelContributionChart data={data} />
        <ChannelRoasChart data={data} />
      </div>
    </div>
  );
}
