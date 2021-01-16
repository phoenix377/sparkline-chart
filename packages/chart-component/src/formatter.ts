
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumSignificantDigits: 3,
});
