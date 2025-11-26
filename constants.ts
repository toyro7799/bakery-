// Prices in Dinars
export const PRICES = {
  BREAD: 0.25,
  MWERGA: 1.0,
  MOSHMAT: 2.0,
  KAAK_SMALL: 5.0,
  KAAK_LARGE: 7.0,
};

// Conversion Rates
export const CONVERSIONS = {
  TAJIN_TO_BREAD: 30,
  KAROUSA_TO_TAJIN: 18,
};

// Calculated Conversion (for convenience)
// 1 Karousa = 18 Tajin * 30 Bread = 540 Bread
export const KAROUSA_TO_BREAD = CONVERSIONS.KAROUSA_TO_TAJIN * CONVERSIONS.TAJIN_TO_BREAD;