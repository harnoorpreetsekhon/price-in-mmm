"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import type { MarketingData } from "@/lib/types";
import { DollarSign, TrendingUp, TestTube2 } from "lucide-react";
import KpiCard from "../kpi-card";

// These parameters would come from a more complex model estimation in a real scenario
const SIMULATION_PARAMS = {
  price_elasticity: -1.5,
  promo_elasticity: 0.8,
  media_coeffs: {
    search: 0.05,
    social: 0.08,
    display: 0.02,
    video: 0.06,
    affiliate: 0.03,
    ooh: 0.04,
    trade: 0.05,
  },
  saturation_alphas: {
    search: 0.8,
    social: 0.9,
    display: 0.7,
    video: 0.85,
    affiliate: 0.75,
    ooh: 0.6,
    trade: 0.8,
  },
  saturation_ks: {
    search: 5000,
    social: 8000,
    display: 4000,
    video: 7000,
    affiliate: 3000,
    ooh: 3500,
    trade: 6000,
  },
};

const saturation = (s: number, alpha: number, k: number): number => {
    return (s ** alpha) / (s ** alpha + k ** alpha);
};

export default function ScenarioSimulationSection({
  data,
}: {
  data: MarketingData[];
}) {
  const baseMetrics = useMemo(() => {
    if (data.length === 0) return null;
    const totalSpend = {
      search: data.reduce((a, b) => a + b.marketing_spend_search, 0),
      social: data.reduce((a, b) => a + b.marketing_spend_social, 0),
      display: data.reduce((a, b) => a + b.marketing_spend_display, 0),
      video: data.reduce((a, b) => a + b.marketing_spend_video, 0),
      affiliate: data.reduce((a, b) => a + b.marketing_spend_affiliate, 0),
      ooh: data.reduce((a, b) => a + b.marketing_spend_ooh, 0),
      trade: data.reduce((a, b) => a + b.marketing_spend_trade, 0),
    };
    const avgPrice = data.reduce((a, b) => a + b.price, 0) / data.length;
    const avgPromoPct = data.reduce((a, b) => a + b.promo_discount_pct, 0) / data.length;
    const baselineRevenue = data.reduce((a,b) => a + (b.baseline_sales * b.price), 0);
    const incrementalRevenue = data.reduce((a,b) => a + (b.media_contribution_total + b.promo_effect) * b.price, 0);

    return { totalSpend, avgPrice, avgPromoPct, baselineRevenue, incrementalRevenue };
  }, [data]);

  const [priceMultiplier, setPriceMultiplier] = useState(1);
  const [promoMultiplier, setPromoMultiplier] = useState(1);
  const [spendMultipliers, setSpendMultipliers] = useState({
    search: 1, social: 1, display: 1, video: 1, affiliate: 1, ooh: 1, trade: 1,
  });

  const handleSpendChange = (channel: keyof typeof spendMultipliers) => (value: number[]) => {
      setSpendMultipliers(prev => ({...prev, [channel]: value[0]}));
  };

  const simulatedRevenue = useMemo(() => {
    if (!baseMetrics) return { simulatedIncremental: 0, newTotalRevenue: 0 };
    
    const simPrice = baseMetrics.avgPrice * priceMultiplier;
    const simPromo = baseMetrics.avgPromoPct * promoMultiplier;

    // Price effect relative to base average price
    const priceEffect = (simPrice - baseMetrics.avgPrice) / baseMetrics.avgPrice * SIMULATION_PARAMS.price_elasticity;
    
    // Promo effect relative to base average promo
    const promoEffect = (simPromo - baseMetrics.avgPromoPct) * SIMULATION_PARAMS.promo_elasticity;

    let mediaEffect = 0;
    for (const channel of Object.keys(baseMetrics.totalSpend)) {
        const key = channel as keyof typeof spendMultipliers;
        const baseSpend = baseMetrics.totalSpend[key];
        const simSpend = baseSpend * spendMultipliers[key];
        
        // Simplified: using total spend. A real model would be weekly.
        const baseSat = saturation(baseSpend, SIMULATION_PARAMS.saturation_alphas[key], SIMULATION_PARAMS.saturation_ks[key]);
        const simSat = saturation(simSpend, SIMULATION_PARAMS.saturation_alphas[key], SIMULATION_PARAMS.saturation_ks[key]);

        const changeInEffect = (simSat - baseSat) * SIMULATION_PARAMS.media_coeffs[key];
        mediaEffect += changeInEffect;
    }

    const totalLiftFactor = 1 + priceEffect + promoEffect + mediaEffect;
    const simulatedIncremental = baseMetrics.incrementalRevenue * totalLiftFactor;
    const newTotalRevenue = baseMetrics.baselineRevenue + simulatedIncremental;

    // Introducing uncertainty
    const uncertaintyFactor = 0.05; // +/- 5%
    const lowerBound = newTotalRevenue * (1 - uncertaintyFactor);
    const upperBound = newTotalRevenue * (1 + uncertaintyFactor);

    return { simulatedIncremental, newTotalRevenue, lowerBound, upperBound };
  }, [baseMetrics, priceMultiplier, promoMultiplier, spendMultipliers]);

  if (!baseMetrics) return null;

  return (
    <div id="simulation">
      <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
        Scenario Simulation
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Simulation Controls</CardTitle>
          <CardDescription>
            Adjust price, promotion, and media spend to simulate revenue outcomes. Values are multipliers of the current period's average.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <h3 className="font-semibold">Pricing & Promotions</h3>
            <div className="space-y-4">
              <Label>Price Multiplier: {formatNumber(priceMultiplier)}x</Label>
              <Slider defaultValue={[1]} min={0.5} max={1.5} step={0.05} onValueChange={(v) => setPriceMultiplier(v[0])}/>
            </div>
            <div className="space-y-4">
              <Label>Promotion Depth Multiplier: {formatNumber(promoMultiplier)}x</Label>
              <Slider defaultValue={[1]} min={0} max={3} step={0.1} onValueChange={(v) => setPromoMultiplier(v[0])}/>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
            <h3 className="font-semibold col-span-full">Media Spend</h3>
            {Object.keys(spendMultipliers).map((channel) => (
                <div key={channel} className="space-y-4">
                    <Label className="capitalize">{channel} Spend: {formatNumber(spendMultipliers[channel as keyof typeof spendMultipliers])}x</Label>
                    <Slider defaultValue={[1]} min={0} max={2} step={0.1} onValueChange={handleSpendChange(channel as keyof typeof spendMultipliers)}/>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <KpiCard
            icon={TestTube2}
            title="Simulated Total Revenue"
            value={formatCurrency(simulatedRevenue.newTotalRevenue)}
            description={`Range: ${formatCurrency(simulatedRevenue.lowerBound)} - ${formatCurrency(simulatedRevenue.upperBound)}`}
        />
         <KpiCard
            icon={TrendingUp}
            title="Simulated Incremental Revenue"
            value={formatCurrency(simulatedRevenue.simulatedIncremental)}
            description="Predicted incremental revenue from this scenario."
        />
        <KpiCard
            icon={DollarSign}
            title="Original Total Revenue"
            value={formatCurrency(baseMetrics.baselineRevenue + baseMetrics.incrementalRevenue)}
            description="Total revenue from the selected period."
        />
         <KpiCard
            icon={TrendingUp}
            title="Original Incremental Revenue"
            value={formatCurrency(baseMetrics.incrementalRevenue)}
            description="Incremental revenue from the selected period."
        />
      </div>
    </div>
  );
}
