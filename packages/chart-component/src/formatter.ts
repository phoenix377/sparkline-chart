
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumSignificantDigits: 3,
});

export const number2Formatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
