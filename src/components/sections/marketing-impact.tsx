import { MarketingData } from "@/lib/types";
import PromoVsNonPromoChart from "../charts/promo-vs-non-promo-chart";
import AdvertisingSaturationCurvesChart from "../charts/advertising-saturation-curves-chart";
import AdstockEffectChart from "../charts/adstock-effect-chart";
import DistributionImpactChart from "../charts/distribution-impact-chart";

export default function MarketingImpactSection({ data }: { data: MarketingData[] }) {
  return (
    <div id="marketing-impact">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        Marketing &amp; Promo Impact
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <PromoVsNonPromoChart data={data} />
        <DistributionImpactChart data={data} />
        <div className="lg:col-span-2">
          <AdvertisingSaturationCurvesChart />
        </div>
        <div className="lg:col-span-2">
          <AdstockEffectChart data={data} />
        </div>
      </div>
    </div>
  );
}
