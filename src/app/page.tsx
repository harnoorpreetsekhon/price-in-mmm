'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import DashboardLayout from '@/components/dashboard-layout';
import CorePerformanceSection from '@/components/sections/core-performance';
import PriceEffectSection from '@/components/sections/price-effect';
import MarketingImpactSection from '@/components/sections/marketing-impact';
import CompetitionSection from '@/components/sections/competition';
import OptimizationSection from '@/components/sections/optimization';
import { mmmData, MarketingData } from '@/lib/data';
import {
  calculateKpis,
  Kpi,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@/lib/calculations';
import {
  DollarSign,
  Target,
  LineChart,
  Megaphone,
  BarChart,
  Percent,
  TrendingUp,
  Swords,
  Crosshair,
} from 'lucide-react';
import KpiCard from '@/components/kpi-card';
import { DateRangePicker } from '@/components/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [kpis, setKpis] = useState<Kpi | null>(null);
  const [filteredData, setFilteredData] = useState<MarketingData[]>([]);
  const [initialDateRange, setInitialDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const defaultDateRange = {
      from: subDays(new Date(), mmmData.length > 0 ? mmmData.length : 365),
      to: new Date(),
    };
    setDateRange(defaultDateRange);
    setInitialDateRange(defaultDateRange);
  }, []);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const filtered = mmmData.filter((d) => {
        const date = new Date(d.date);
        return date >= dateRange.from! && date <= dateRange.to!;
      });
      setFilteredData(filtered);
      setKpis(calculateKpis(filtered));
    }
  }, [dateRange]);

  const kpiConfig = [
    {
      title: 'Total Revenue',
      key: 'totalRevenue',
      icon: DollarSign,
      formatter: formatCurrency,
      description: 'Total sales revenue over the period.',
    },
    {
      title: 'Baseline Revenue',
      key: 'baselineRevenue',
      icon: BarChart,
      formatter: formatCurrency,
      description:
        'Projected sales revenue assuming no marketing or promotional activities occurred.',
    },
    {
      title: 'Incremental Revenue',
      key: 'incrementalRevenue',
      icon: TrendingUp,
      formatter: formatCurrency,
      description:
        'Revenue generated directly from marketing and promotional activities.',
    },
    {
      title: 'Total Marketing Spend',
      key: 'totalMarketingSpend',
      icon: Megaphone,
      formatter: formatCurrency,
      description: 'Total investment across all marketing channels.',
    },
    {
      title: 'Total ROAS',
      key: 'totalROAS',
      icon: Target,
      formatter: (val: number) => `${formatNumber(val)}x`,
      description:
        'Return on Ad Spend, calculated as Incremental Revenue divided by Marketing Spend.',
    },
    {
      title: 'Price Elasticity',
      key: 'priceElasticity',
      icon: LineChart,
      formatter: formatNumber,
      description:
        'Measures how sales volume responds to price changes, isolated from other factors.',
    },
    {
      title: 'Optimal Price (Revenue)',
      key: 'optimalPriceRevenue',
      icon: DollarSign,
      formatter: formatCurrency,
      description:
        'The model-estimated price point that maximizes total revenue.',
    },
    {
      title: 'Optimal Price (Profit)',
      key: 'optimalPriceProfit',
      icon: DollarSign,
      formatter: formatCurrency,
      description:
        'The model-estimated price point that maximizes total profit.',
    },
    {
      title: 'Promo Uplift',
      key: 'promoUplift',
      icon: Percent,
      formatter: formatPercentage,
      description: 'Average sales lift during promotional periods.',
    },
    {
      title: 'Comp. Price Pressure',
      key: 'competitorPricePressureIndex',
      icon: Swords,
      formatter: formatNumber,
      description: 'Index of competitor pricing impact on sales.',
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Price in MMM
          </h1>
          <div className="flex items-center space-x-2">
            <DateRangePicker initialDate={initialDateRange} onApply={setDateRange} />
          </div>
        </div>

        <div
          id="kpis"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {kpis ? (
            kpiConfig.map((kpi) => (
              <KpiCard
                key={kpi.key}
                title={kpi.title}
                value={kpi.formatter(kpis[kpi.key as keyof Kpi])}
                icon={kpi.icon}
                description={kpi.description}
              />
            ))
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {kpis ? (
          <div className="space-y-8">
            <CorePerformanceSection data={filteredData} />
            <PriceEffectSection data={filteredData} kpis={kpis} />
            <MarketingImpactSection data={filteredData} />
            <CompetitionSection data={filteredData} />
            <OptimizationSection data={filteredData} />
          </div>
        ) : (
          <div className="space-y-8">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
