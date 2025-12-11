"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MarketingData } from "@/lib/types";
import { formatNumber } from "@/lib/calculations";

// Helper to create color scale
const getColor = (value: number, min: number, max: number) => {
    if (min === max) return `hsl(120, 70%, 85%)`;
    const percent = (value - min) / (max - min);
    const hue = percent * 120; // 0 (red) to 120 (green)
    return `hsl(${hue}, 70%, 85%)`;
};


export default function PricePromoInteractionHeatmap({
  data,
}: {
  data: MarketingData[];
}) {
  const priceBands = 4;
  const promoBands = 3; // No Promo, Low Discount, High Discount

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const priceStep = (maxPrice - minPrice) / priceBands;
  
  const heatmapData = Array.from({ length: promoBands }, () => 
    Array(priceBands).fill(null).map(() => ({ sales: 0, count: 0 }))
  );

  data.forEach(d => {
    const priceBandIndex = Math.min(priceBands - 1, Math.floor((d.price - minPrice) / priceStep));
    let promoBandIndex = 0;
    if (d.promo_flag) {
        promoBandIndex = d.promo_discount_pct < 0.15 ? 1 : 2;
    }

    if (heatmapData[promoBandIndex] && heatmapData[promoBandIndex][priceBandIndex]) {
        heatmapData[promoBandIndex][priceBandIndex].sales += d.sales;
        heatmapData[promoBandIndex][priceBandIndex].count += 1;
    }
  });

  const avgSalesData = heatmapData.map(row => 
    row.map(cell => cell.count > 0 ? cell.sales / cell.count : 0)
  );
  
  const allSales = avgSalesData.flat().filter(s => s > 0);
  const minSales = Math.min(...allSales);
  const maxSales = Math.max(...allSales);

  const priceLabels = Array.from({ length: priceBands }, (_, i) => `$${(minPrice + i * priceStep).toFixed(2)} - $${(minPrice + (i + 1) * priceStep).toFixed(2)}`);
  const promoLabels = ["No Promo", "Low Promo", "High Promo"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price × Promo Interaction Heatmap</CardTitle>
        <CardDescription>
          Average weekly sales volume based on price and promotion level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promo Level</TableHead>
              {priceLabels.map(label => <TableHead key={label} className="text-center">{label}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoLabels.map((promoLabel, promoIndex) => (
              <TableRow key={promoLabel}>
                <TableCell className="font-medium">{promoLabel}</TableCell>
                {avgSalesData[promoIndex].map((avgSales, priceIndex) => (
                  <TableCell
                    key={`${promoIndex}-${priceIndex}`}
                    className="text-center"
                    style={{ backgroundColor: avgSales > 0 ? getColor(avgSales, minSales, maxSales) : 'transparent' }}
                  >
                    {avgSales > 0 ? formatNumber(avgSales) : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
