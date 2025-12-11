import DashboardLayout from "@/components/dashboard-layout";
import CorePerformanceSection from "@/components/sections/core-performance";
import PriceEffectSection from "@/components/sections/price-effect";
import MarketingImpactSection from "@/components/sections/marketing-impact";
import CompetitionSection from "@/components/sections/competition";
import { mmmData, MarketingData } from "@/lib/data";
import {
  calculateKpis,
  Kpi,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/lib/calculations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  Target,
  LineChart,
  Megaphone,
  BarChart,
  Percent,
  TrendingUp,
  Swords,
  Badge,
} from "lucide-react";
import KpiCard from "@/components/kpi-card";

export default function Home() {
  const data: MarketingData[] = mmmData;
  const kpis = calculateKpis(data);

  const kpiConfig = [
    {
      title: "Total Revenue",
      key: "totalRevenue",
      icon: DollarSign,
      formatter: formatCurrency,
      description: "Total sales revenue over the period.",
    },
    {
      title: "Baseline Revenue",
      key: "baselineRevenue",
      icon: BarChart,
      formatter: formatCurrency,
      description: "Revenue generated without any marketing activities.",
    },
    {
      title: "Incremental Revenue",
      key: "incrementalRevenue",
      icon: TrendingUp,
      formatter: formatCurrency,
      description: "Revenue directly attributable to marketing efforts.",
    },
    {
      title: "Total Marketing Spend",
      key: "totalMarketingSpend",
      icon: Megaphone,
      formatter: formatCurrency,
      description: "Total investment across all marketing channels.",
    },
    {
      title: "Total ROAS",
      key: "totalROAS",
      icon: Target,
      formatter: (val: number) => `${formatNumber(val)}x`,
      description: "Return on Ad Spend. (Incremental Revenue / Marketing Spend)",
    },
    {
      title: "Price Elasticity",
      key: "priceElasticity",
      icon: LineChart,
      formatter: formatNumber,
      description: "Sensitivity of demand to price changes.",
    },
    {
      title: "Optimal Price (Revenue)",
      key: "optimalPriceRevenue",
      icon: DollarSign,
      formatter: formatCurrency,
      description: "Price that maximizes total revenue.",
    },
    {
      title: "Optimal Price (Profit)",
      key: "optimalPriceProfit",
      icon: DollarSign,
      iconColor: "text-green-500",
      formatter: formatCurrency,
      description: "Price that maximizes total profit.",
    },
    {
      title: "Promo Uplift",
      key: "promoUplift",
      icon: Percent,
      formatter: formatPercentage,
      description: "Average sales lift during promotional periods.",
    },
    {
      title: "Comp. Price Pressure",
      key: "competitorPricePressureIndex",
      icon: Swords,
      formatter: formatNumber,
      description: "Index of competitor pricing impact on sales.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            MarketMix Navigator
          </h1>
        </div>

        <div
          id="kpis"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {kpiConfig.map((kpi) => (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={kpi.formatter(kpis[kpi.key as keyof Kpi])}
              icon={kpi.icon}
              description={kpi.description}
            />
          ))}
        </div>

        <div className="space-y-8">
          <CorePerformanceSection data={data} />
          <PriceEffectSection data={data} kpis={kpis}/>
          <MarketingImpactSection data={data} />
          <CompetitionSection data={data} />
        </div>
      </div>
    </DashboardLayout>
  );
}
