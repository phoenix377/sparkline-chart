import { PastPeriodNames, Periods } from './constants'

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  useGrouping: false,
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
    differencePercentRaw || 0
  )}%`
  difference = `${currencyFormatter.format(differenceRaw)} (${differencePercent})`
  if (!difference.startsWith('-') && differenceRaw) {
    difference = `+${difference}`
  }
  return difference
}

export const pastPeriodLabel = (range) => {
  switch (range) {
    case Periods.ONE_DAY:
      return PastPeriodNames.ONE_DAY
    case Periods.ONE_WEEK:
      return PastPeriodNames.ONE_WEEK
    case Periods.ONE_MONTH:
      return PastPeriodNames.ONE_MONTH
    case Periods.THREE_MONTH:
      return PastPeriodNames.THREE_MONTH
    default:
      return PastPeriodNames.DEFAULT
  }
}
