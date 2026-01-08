import type { MarketingData } from './types';
import { subWeeks, format } from 'date-fns';

const TOTAL_WEEKS = 104;

// Helper functions for data generation
const adstock = (spend: number[], decay: number): number[] => {
  const adstocked_spend: number[] = [];
  let last_adstock = 0;
  for (const s of spend) {
    last_adstock = s + decay * last_adstock;
    adstocked_spend.push(last_adstock);
  }
  return adstocked_spend;
};

const saturation = (spend: number[], alpha: number, k: number): number[] => {
  return spend.map(s => (s ** alpha) / (s ** alpha + k ** alpha));
};

const generateDummyData = (): MarketingData[] => {
  const data: Partial<MarketingData>[] = [];
  const today = new Date();

  // 1. Generate independent variables
  let spend_search = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 2000 + 500);
  let spend_social = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 3000 + 1000);
  let spend_display = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 1500 + 300);
  let spend_video = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 2500 + 800);
  let spend_affiliate = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 1000 + 200);
  let spend_ooh = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 1200 + 400);
  let spend_trade = Array.from({ length: TOTAL_WEEKS }, () => Math.random() * 1800 + 600);


  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const week = TOTAL_WEEKS - i;
    const date = format(subWeeks(today, i), 'yyyy-MM-dd');
    
    // Introduce some campaign spikes
    if (i % 26 < 4) { // Quarterly campaigns
        spend_search[i] *= 1.5;
        spend_social[i] *= 1.8;
        spend_video[i] *= 1.7;
        spend_ooh[i] *= 1.4;
    }
    if (i > 90) { // Holiday season
        spend_search[i] *= 2;
        spend_social[i] *= 2.5;
        spend_display[i] *= 1.5;
        spend_video[i] *= 2.2;
        spend_trade[i] *= 1.8;
    }

    const price = 19.99 + Math.sin(i / 10) * 2 + (Math.random() - 0.5) * 2;
    const competitor_price = price * (1 + (Math.random() - 0.5) * 0.2);
    const promo_flag = Math.random() < 0.25;
    const promo_discount_pct = promo_flag ? 0.1 + Math.random() * 0.15 : 0;

    data.push({
      week,
      date,
      price,
      competitor_price,
      promo_flag,
      promo_discount_pct,
      cost_of_goods: price * 0.4,
      distribution_score: 75 + Math.sin(i/20) * 10 + Math.random() * 5,
      competitor_promos: Math.random() < 0.3 ? 1 : 0,
      market_share: 0.2 + Math.random() * 0.05,
    });
  }
  
  // Reverse to have chronological order
  data.reverse();
  spend_search.reverse();
  spend_social.reverse();
  spend_display.reverse();
  spend_video.reverse();
  spend_affiliate.reverse();
  spend_ooh.reverse();
  spend_trade.reverse();

  // 2. Apply Adstock and Saturation
  const adstocked_search = adstock(spend_search, 0.5);
  const adstocked_social = adstock(spend_social, 0.7);
  const adstocked_display = adstock(spend_display, 0.3);
  const adstocked_video = adstock(spend_video, 0.8);
  const adstocked_affiliate = adstock(spend_affiliate, 0.4);
  const adstocked_ooh = adstock(spend_ooh, 0.2);
  const adstocked_trade = adstock(spend_trade, 0.6);

  const saturated_search = saturation(adstocked_search, 0.8, 5000);
  const saturated_social = saturation(adstocked_social, 0.9, 8000);
  const saturated_display = saturation(adstocked_display, 0.7, 4000);
  const saturated_video = saturation(adstocked_video, 0.85, 7000);
  const saturated_affiliate = saturation(adstocked_affiliate, 0.75, 3000);
  const saturated_ooh = saturation(adstocked_ooh, 0.6, 3500);
  const saturated_trade = saturation(adstocked_trade, 0.8, 6000);

  // 3. Calculate dependent variables and contributions
  const finalData: MarketingData[] = [];
  const avg_price = data.reduce((sum, d) => sum + d.price!, 0) / TOTAL_WEEKS;
  const avg_comp_price = data.reduce((sum, d) => sum + d.competitor_price!, 0) / TOTAL_WEEKS;

  for (let i = 0; i < TOTAL_WEEKS; i++) {
    const d = data[i];

    const seasonality_index = 1 + Math.sin((i / 52) * 2 * Math.PI - Math.PI / 2) * 0.2 + (i > 45 && i < 52 ? 0.3 : 0);
    const baseline_sales = (20000 + i * 50) * seasonality_index * (d.distribution_score! / 80);

    const media_contribution_search = saturated_search[i] * 15000;
    const media_contribution_social = saturated_social[i] * 25000;
    const media_contribution_display = saturated_display[i] * 8000;
    const media_contribution_video = saturated_video[i] * 20000;
    const media_contribution_affiliate = saturated_affiliate[i] * 10000;
    const media_contribution_ooh = saturated_ooh[i] * 9000;
    const media_contribution_trade = saturated_trade[i] * 12000;
    
    const media_contribution_total = media_contribution_search + media_contribution_social + media_contribution_display + media_contribution_video + media_contribution_affiliate + media_contribution_ooh + media_contribution_trade;

    const price_effect = (d.price! - avg_price) * -3000;
    const promo_effect = d.promo_discount_pct! * 50000;
    const competition_effect = (d.competitor_price! - avg_comp_price) * 800;
    
    const predicted_sales = baseline_sales + media_contribution_total + price_effect + promo_effect + competition_effect;
    const sales = Math.round(predicted_sales * (1 + (Math.random() - 0.5) * 0.05));
    const gross_margin = (d.price! - d.cost_of_goods!) / d.price!;
    
    finalData.push({
      ...d,
      sales,
      gross_margin,
      seasonality_index,
      baseline_sales,
      media_contribution_total,
      media_contribution_search,
      media_contribution_social,
      media_contribution_display,
      media_contribution_video,
      media_contribution_affiliate,
      media_contribution_ooh,
      media_contribution_trade,
      price_effect,
      promo_effect,
      competition_effect,
      predicted_sales,
      marketing_spend_search: spend_search[i],
      marketing_spend_social: spend_social[i],
      marketing_spend_display: spend_display[i],
      marketing_spend_video: spend_video[i],
      marketing_spend_affiliate: spend_affiliate[i],
      marketing_spend_ooh: spend_ooh[i],
      marketing_spend_trade: spend_trade[i],
    } as MarketingData);
  }

  return finalData;
};

export const mmmData: MarketingData[] = generateDummyData();
