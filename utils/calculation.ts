import { BakeryCounts, CalculatedTotals } from '../types';
import { PRICES, CONVERSIONS, KAROUSA_TO_BREAD } from '../constants';

export const calculateTotals = (counts: BakeryCounts): CalculatedTotals => {
  // 1. Calculate Bread Totals
  const breadFromKarousa = counts.karousa * KAROUSA_TO_BREAD;
  const breadFromTajin = counts.tajin * CONVERSIONS.TAJIN_TO_BREAD;
  const totalBread = breadFromKarousa + breadFromTajin + counts.bread;

  // 2. Calculate Tajin Display Total (Karousa converted + Direct Tajin)
  const tajinFromKarousa = counts.karousa * CONVERSIONS.KAROUSA_TO_TAJIN;
  const totalTajin = tajinFromKarousa + counts.tajin;

  // 3. Pastry Totals
  const totalPastryCount = 
    counts.mwerga + 
    counts.moshmat + 
    counts.kaakSmall + 
    counts.kaakLarge;

  // 4. Price Calculation
  const priceBread = totalBread * PRICES.BREAD;
  const priceMwerga = counts.mwerga * PRICES.MWERGA;
  const priceMoshmat = counts.moshmat * PRICES.MOSHMAT;
  const priceKaakSmall = counts.kaakSmall * PRICES.KAAK_SMALL;
  const priceKaakLarge = counts.kaakLarge * PRICES.KAAK_LARGE;

  const totalPrice = 
    priceBread + 
    priceMwerga + 
    priceMoshmat + 
    priceKaakSmall + 
    priceKaakLarge;

  return {
    totalKarousa: counts.karousa,
    totalTajin,
    totalBread,
    totalPastryCount,
    totalPrice
  };
};

export const aggregateTotals = (totalsList: CalculatedTotals[]): CalculatedTotals => {
  return totalsList.reduce((acc, curr) => ({
    totalKarousa: acc.totalKarousa + curr.totalKarousa,
    totalTajin: acc.totalTajin + curr.totalTajin,
    totalBread: acc.totalBread + curr.totalBread,
    totalPastryCount: acc.totalPastryCount + curr.totalPastryCount,
    totalPrice: acc.totalPrice + curr.totalPrice,
  }), { 
    totalKarousa: 0, 
    totalTajin: 0, 
    totalBread: 0, 
    totalPastryCount: 0, 
    totalPrice: 0 
  });
};

export const aggregateCounts = (countsList: BakeryCounts[]): BakeryCounts => {
  return countsList.reduce((acc, curr) => ({
    karousa: acc.karousa + curr.karousa,
    tajin: acc.tajin + curr.tajin,
    bread: acc.bread + curr.bread,
    mwerga: acc.mwerga + curr.mwerga,
    moshmat: acc.moshmat + curr.moshmat,
    kaakSmall: acc.kaakSmall + curr.kaakSmall,
    kaakLarge: acc.kaakLarge + curr.kaakLarge,
  }), {
    karousa: 0,
    tajin: 0,
    bread: 0,
    mwerga: 0,
    moshmat: 0,
    kaakSmall: 0,
    kaakLarge: 0,
  });
};