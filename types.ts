export interface BakeryCounts {
  karousa: number;
  tajin: number;
  bread: number;
  mwerga: number;
  moshmat: number;
  kaakSmall: number;
  kaakLarge: number;
}

export interface CalculatedTotals {
  totalKarousa: number;
  totalTajin: number;
  totalBread: number;
  totalPastryCount: number;
  totalPrice: number;
}

export interface SubInvoice {
  id: string;
  timestamp: string;
  counts: BakeryCounts;
  totals: CalculatedTotals;
}

export interface HistoryRecord {
  id: string;
  date: string;
  counts: BakeryCounts; // Aggregated counts
  totals: CalculatedTotals; // Aggregated totals
  subInvoices?: SubInvoice[]; // List of sub-invoices
}

export enum ItemType {
  KAROUSA = 'KAROUSA',
  TAJIN = 'TAJIN',
  BREAD = 'BREAD',
  MWERGA = 'MWERGA',
  MOSHMAT = 'MOSHMAT',
  KAAK_SMALL = 'KAAK_SMALL',
  KAAK_LARGE = 'KAAK_LARGE',
}