export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumSignificantDigits: 3,
})

export const number2Formatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const getDifference = (
  activePriceRaw: number | null,
  maxPriceRaw: number,
  closePrice: number
): string => {
  let difference: string | null = null
  const differenceRaw = (activePriceRaw || maxPriceRaw) - closePrice
  const differencePercentRaw = ((activePriceRaw || maxPriceRaw) / closePrice) * 100 - 100
  const differencePercent = `${differencePercentRaw > 0 ? '+' : ''}${number2Formatter.format(
    differencePercentRaw
  )}%`
  difference = `${currencyFormatter.format(differenceRaw)} (${differencePercent})`
  if (!difference.startsWith('-') && differenceRaw) {
    difference = `+${difference}`
  }
  return difference
}
