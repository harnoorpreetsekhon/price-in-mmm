import { MarketingData } from "@/lib/types";
import CompetitorPriceTrendChart from "../charts/competitor-price-trend-chart";
import MarketShareVsPriceGapChart from "../charts/market-share-vs-price-gap-chart";

export default function CompetitionSection({ data }: { data: MarketingData[] }) {
  return (
    <div id="competition">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        Competition & Market Forces
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <CompetitorPriceTrendChart data={data} />
        <MarketShareVsPriceGapChart data={data} />
      </div>
    </div>
  );
}
