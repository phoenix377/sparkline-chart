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
  DEFAULT = '',
}

export enum Colors {
  RED = 'rgb(239, 64, 60)',
  GREEN = 'rgb(0, 183, 70)',
  LINE_CHART = '#21ce99',
  LINE_CHART_INACTIVE_LIGHT = '#61ffcf',
  LINE_CHART_INACTIVE = '#0e5c43',
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
}

export enum Subtract {
  TWO_PERCENT = 0.98,
}

export const POINTS_PER_DAY = 96
export const MINUTE = 60
export const HOUR = 60 * MINUTE
export const DAY = HOUR * 24
export const MONTH = DAY * 30
