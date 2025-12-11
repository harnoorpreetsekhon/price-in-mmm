import { MarketingData } from "@/lib/types";
import { Kpi } from "@/lib/calculations";
import PriceTrendChart from "../charts/price-trend-chart";
import PriceVsRevenueChart from "../charts/price-vs-revenue-chart";
import PriceElasticityChart from "../charts/price-elasticity-chart";
import RevenueVsPriceChart from "../charts/revenue-vs-price-chart";
import ProfitVsPriceChart from "../charts/profit-vs-price-chart";
import PricePromoInteractionHeatmap from "../charts/price-promo-interaction-heatmap";

export default function PriceEffectSection({ data, kpis }: { data: MarketingData[], kpis: Kpi }) {
  return (
    <div id="price-effect">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        Price Effect Insights
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <PriceTrendChart data={data} />
        </div>
        <div className="lg:col-span-2">
            <PriceVsRevenueChart data={data} />
        </div>
        <PriceElasticityChart data={data} priceElasticity={kpis.priceElasticity} />
        <RevenueVsPriceChart data={data} optimalPrice={kpis.optimalPriceRevenue} />
        <ProfitVsPriceChart data={data} optimalPrice={kpis.optimalPriceProfit} />
        <div className="lg:col-span-3">
          <PricePromoInteractionHeatmap data={data} />
        </div>
      </div>
    </div>
  );
}
