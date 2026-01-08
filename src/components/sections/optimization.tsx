import { MarketingData } from "@/lib/types";
import BudgetOptimizationChart from "../charts/budget-optimization-chart";
import AdvertisingSaturationCurvesChart from "../charts/advertising-saturation-curves-chart";

export default function OptimizationSection({ data }: { data: MarketingData[] }) {
  return (
    <div id="optimization">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        Budget Optimization
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <BudgetOptimizationChart data={data} />
        <AdvertisingSaturationCurvesChart />
      </div>
    </div>
  );
}
