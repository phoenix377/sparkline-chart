import moment from 'moment'

import { Colors, DateFormats, DAY, HOUR, MINUTE, Periods, POINTS_PER_DAY } from '../constants'

export const dateFormat = (range: number) => {
  switch (range) {
    case Periods.ONE_DAY:
      return DateFormats.LT
    case Periods.ONE_WEEK:
    case Periods.ONE_MONTH:
      return DateFormats.MDLT
    default:
      return DateFormats.MDY
  }
}

export const minimalUnit = (range: number, length: number, isMobile?: boolean) => {
  if (isMobile) {
    return 0
  }

  if (length < 40) {
    switch (range) {
      case Periods.ONE_DAY:
        return HOUR / 10
      case Periods.ONE_WEEK:
        return DAY / 4
      case Periods.ONE_MONTH:
        return 2.1 * DAY
      case Periods.THREE_MONTH:
        return 2.1 * DAY
      case Periods.ALL:
        return 2.1 * DAY
      default:
        return 0
    }
  } else {
    switch (range) {
      case Periods.ONE_DAY:
        return HOUR * 0.75
      case Periods.ONE_WEEK:
        return DAY / 4
      case Periods.ONE_MONTH:
        return DAY * 0.75
      case Periods.THREE_MONTH:
        return DAY * 0.75
      case Periods.ALL:
        return DAY * 0.75
      default:
        return 0
    }
  }
}

export const fillDay = (initial) => {
  const dataWAvg = [...initial]
  const lastDate =
    dataWAvg?.[dataWAvg.length - 2]?.date ||
    dataWAvg?.[dataWAvg.length - 1]?.date ||
    moment.utc().unix()

  let i = 1
  while (dataWAvg.length < POINTS_PER_DAY) {
    dataWAvg.push({
      date: lastDate + MINUTE * 15 * i,
    } as any)
    i += 1
  }
  return dataWAvg
}

export const chartLine = (
  dataKey = 'high',
  stroke: string = Colors.LINE_CHART,
  dotStroke: string = Colors.DOT_BLACK_STROKE,
  dotColor = Colors.LINE_CHART
) => ({
  activeDot: { stroke: dotStroke, fill: dotColor, strokeWidth: 2, r: 7 },
  connectNulls: true,
  dataKey,
  dot: false,
  stroke,
  strokeDasharray: '',
  strokeWidth: 2,
  type: 'monotone',
})

export const avgLine = (dataKey = 'closePrice') => ({
  activeDot: false,
  connectNulls: true,
  dataKey,
  dot: false,
  stroke: '#4e4e4e',
  strokeDasharray: '2 6',
  strokeWidth: 2,
  type: 'monotone',
})

export const getCandlestickOptions = ({ mobile, endDate, max, min, onIndexHover, range, startDate }) => {
  return {
    chart: {
      events: {
        mouseMove(_event, _chartContext, config) {
          onIndexHover(config.dataPointIndex)
        },
      },
      type: 'candlestick',
      width: '100%',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    tooltip: {
      enabled: true,
      followCursor: false,
      shared: false,
      custom: () => '<div></div>',
    },
    markers: {
      size: 1,
    },
    xaxis: {
      axisTicks: {
        height: 4,
      },
      labels: {
        style: {
          fontSize: mobile ? '11px' : '12px',
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: mobile ? 'MMM' : "MMM 'yy",
          day: mobile ? 'dd.MM' : 'dd MMM',
          hour: 'HH:mm',
        },
      },
      min: startDate,
      max: endDate,
      type: 'datetime',
      tooltip: {
        enabled: true,
        formatter: (date, context) => {
          const { dataPointIndex } = context
          const actualDate = context?.w?.config?.series?.[0]?.data?.[dataPointIndex]?.temp
          return moment
            .unix(actualDate || date / 1000)
            .utc()
            .format(dateFormat(range))
        },
      },
    },
    yaxis: {
      show: false,
      min,
      max,
      decimalsInFloat: 3,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
      tooltip: { enabled: true },
    },
  }
}
