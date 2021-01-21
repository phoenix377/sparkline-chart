export const dateFormat = (range: number) => {
  switch (range) {
    case 15:
      return 'LLL'
    case 60:
    case 480:
      return 'MMM D, LT'
    default:
      return 'MMM D, YYYY'
  }
}

export const fillDay = (initial, closePrice) => {
  const dataWAvg = [...initial]
  const lastDate = dataWAvg[dataWAvg.length - 1].date
  let i = 1
  while (dataWAvg.length < 96) {
    dataWAvg.push({
      date: lastDate + 900 * i,
      closePrice,
    } as any)
    i += 1
  }
  return dataWAvg
}

export const chartLine = (dataKey = 'high', stroke = '#21ce99') => ({
  activeDot: { stroke: '#1b1b1d', fill: '#21ce99', strokeWidth: 2, r: 7 },
  connectNulls: true,
  dataKey,
  dot: false,
  stroke,
  strokeDasharray: '',
  strokeWidth: 2,
  type: 'basis',
})

export const avgLine = (dataKey = 'closePrice') => ({
  activeDot: false,
  connectNulls: true,
  dataKey,
  dot: false,
  stroke: '#4e4e4e',
  strokeDasharray: '2 5',
  strokeWidth: 2,
  type: 'monotone',
})

export const getCandlestickOptions = ({ dataPointMouseEnter, dataPointMouseLeave }) => {
  return {
    chart: {
      events: {
        dataPointMouseEnter,
        dataPointMouseLeave,
      },
      type: 'candlestick',
      height: 260,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      grid: {
        show: false,
        borderColor: '#90A4AE',
      },
    },
    tooltip: {
      enabled: true,
      followCursor: true,
      shared: false,
      custom: () => '<div></div>',
      marker: {
        show: false,
      },
    },
    markers: {
      size: 1,
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }
}
