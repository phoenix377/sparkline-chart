export enum Periods {
  ONE_DAY = 15,
  ONE_WEEK = 60,
  ONE_MONTH = 15 * 32,
  THREE_MONTH = 15 * 96,
  // TODO: 42 is a fake number, replace it with real value for ALL period
  ALL = 42,
}

export enum PeriodsLabels {
  ONE_DAY = '1D',
  ONE_WEEK = '1W',
  ONE_MONTH = '1M',
  THREE_MONTH = '3M',
  ALL = 'ALL',
}

export enum PastPeriodNames {
  ONE_DAY = 'TODAY',
  ONE_WEEK = 'PAST WEEK',
  ONE_MONTH = 'PAST MONTH',
  THREE_MONTH = 'PAST 3 MONTHS',
  DEFAULT = 'ALL TIME',
}

export enum Colors {
  RED = 'rgb(239, 64, 60)',
  GREEN = 'rgb(0, 183, 70)',
  LINE_CHART = 'rgb(0, 183, 70)',
  LINE_CHART_INACTIVE_LIGHT = '#B7EFB7',
  LINE_CHART_INACTIVE = '#0e5c43',
  LINE_CHART_NEGATIVE = 'rgb(239, 64, 60)',
  LINE_CHART_NEGATIVE_INACTIVE_LIGHT = '#FFCDB7',
  LINE_CHART_NEGATIVE_INACTIVE = '#662000',
  DOT_BLACK_STROKE = '#1b1b1d',
  DOT_WHITE_STROKE = '#ffffff',
}
export enum DateFormats {
  LT = 'LT',
  MDLT = 'MMM D, LT',
  MDY = 'MMM D, YYYY',
}

export enum Add {
  TWO_PERCENT = 1.02,
  TWO_PER_MILLE = 1.002,
  FOUR_PER_MILLE = 1.004,
}

export enum Subtract {
  TWO_PERCENT = 0.98,
  TWO_PER_MILLE = 0.998,
  FOUR_PER_MILLE = 0.996,
}

export const POINTS_PER_DAY = 96
export const SECOND = 1000
export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = HOUR * 24
export const MONTH = DAY * 30
