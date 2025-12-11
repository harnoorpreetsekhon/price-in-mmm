import type { MarketingData } from "./types";

export type Kpi = {
  totalRevenue: number;
  baselineRevenue: number;
  incrementalRevenue: number;
  totalMarketingSpend: number;
  totalROAS: number;
  priceElasticity: number;
  optimalPriceRevenue: number;
  optimalPriceProfit: number;
  promoUplift: number;
  competitorPricePressureIndex: number;
};

// Formatting helpers
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
};

// KPI Calculation
export const calculateKpis = (data: MarketingData[]): Kpi => {
  const totalRevenue = data.reduce((sum, d) => sum + d.sales * d.price, 0);
  const baselineRevenue = data.reduce(
    (sum, d) => sum + d.baseline_sales * d.price,
    0
  );
  const incrementalRevenue = data.reduce(
    (sum, d) =>
      sum +
      (d.media_contribution_total + d.promo_effect) * d.price,
    0
  );

  const totalMarketingSpend = data.reduce(
    (sum, d) =>
      sum +
      d.marketing_spend_search +
      d.marketing_spend_social +
      d.marketing_spend_display +
      d.marketing_spend_video +
      d.marketing_spend_affiliate,
    0
  );
  
  const totalROAS =
    totalMarketingSpend > 0 ? incrementalRevenue / totalMarketingSpend : 0;

  // Simplified Price Elasticity calculation from data
  // Using linear regression on log-log model: log(Q) = a + b*log(P) where b is elasticity
  let sum_log_p = 0, sum_log_q = 0, sum_log_p_sq = 0, sum_log_pq = 0;
  const n = data.length;
  data.forEach(d => {
    const log_p = Math.log(d.price);
    const log_q = Math.log(d.sales);
    sum_log_p += log_p;
    sum_log_q += log_q;
    sum_log_p_sq += log_p * log_p;
    sum_log_pq += log_p * log_q;
  });

  const priceElasticity = (n * sum_log_pq - sum_log_p * sum_log_q) / (n * sum_log_p_sq - sum_log_p * sum_log_p);
  const intercept = (sum_log_q - priceElasticity * sum_log_p) / n;
  const a_demand = Math.exp(intercept);

  // For linear demand Q = a - bP, let's estimate b from elasticity at average price/qty
  const avgPrice = data.reduce((s,d) => s+d.price, 0) / n;
  const avgSales = data.reduce((s,d) => s+d.sales, 0) / n;
  const b_demand = -priceElasticity * (avgSales / avgPrice);
  const a_linear_demand = avgSales + b_demand * avgPrice;
  const avgCost = data.reduce((s,d) => s+d.cost_of_goods, 0) / n;

  const optimalPriceRevenue = a_linear_demand / (2 * b_demand);
  const optimalPriceProfit = (a_linear_demand + b_demand * avgCost) / (2 * b_demand);


  const promoSales = data.filter(d => d.promo_flag).reduce((s,d) => s+d.sales, 0);
  const promoWeeks = data.filter(d => d.promo_flag).length;
  const avgPromoSales = promoWeeks > 0 ? promoSales / promoWeeks : 0;

  const nonPromoSales = data.filter(d => !d.promo_flag).reduce((s,d) => s+d.sales, 0);
  const nonPromoWeeks = data.filter(d => !d.promo_flag).length;
  const avgNonPromoSales = nonPromoWeeks > 0 ? nonPromoSales / nonPromoWeeks : 0;

  const promoUplift = avgNonPromoSales > 0 ? (avgPromoSales - avgNonPromoSales) / avgNonPromoSales : 0;

  // Simplified index
  const competitorPricePressureIndex = data.reduce((sum, d) => sum + (d.price / d.competitor_price - 1) * d.competition_effect, 0) / data.length / 1000;


  return {
    totalRevenue,
    baselineRevenue,
    incrementalRevenue,
    totalMarketingSpend,
    totalROAS,
    priceElasticity,
    optimalPriceRevenue: optimalPriceRevenue > 0 && optimalPriceRevenue < 50 ? optimalPriceRevenue : avgPrice * 1.1, // cap unrealistic values
    optimalPriceProfit: optimalPriceProfit > 0 && optimalPriceProfit < 60 ? optimalPriceProfit : avgPrice * 1.25, // cap unrealistic values
    promoUplift,
    competitorPricePressureIndex,
  };
};
