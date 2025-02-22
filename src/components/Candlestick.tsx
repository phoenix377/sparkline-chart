import moment from 'moment'
import * as React from 'react'
import Chart from 'react-apexcharts'

import { Add, Periods, POINTS_PER_DAY, Subtract } from '../constants'
import { fillDay, getCandlestickOptions, minimalUnit } from './chartUtils'

import type { DataPoint } from '../types'

type Props = {
  data: DataPoint[]

  range?: number | null
  onDataHover?: (value: number | null) => void
  closePrice?: number | null
  height?: number
}

const CandlestickChart: React.FC<Props> = ({ data, onDataHover, range, height = 275 }) => {
  const [series, setSeries] = React.useState<any[]>([])
  const isMobile = window?.screen?.width <= 480;

  const max =
    data.reduce((highest, current) => Math.max(highest, current.high), data[0]?.high || 0) *
    Add.FOUR_PER_MILLE

  const min =
    data.reduce((lowest, current) => Math.min(lowest, current.low), data[0]?.low || 0) *
    Subtract.FOUR_PER_MILLE

  let minDate: number | null = null
  let maxDate: number | null = null

  minDate =
    series.reduce((lowest, current) => Math.min(lowest, current.temp), series[0]?.temp || 0) -
    minimalUnit(range || 0, data.length, isMobile)

  maxDate =
    series.reduce((highest, current) => Math.max(highest, current.temp), series[0]?.temp || 0) +
    minimalUnit(range || 0, data.length, isMobile)

  const onMove = React.useCallback(
    (idx) => {
      onDataHover?.(data?.[idx]?.close || null)
    },
    [onDataHover, data]
  )

  const options = getCandlestickOptions({
    mobile: isMobile,
    onIndexHover: onMove,
    min,
    max,
    range,
    startDate: minDate ? minDate * 1000 : undefined,
    endDate: maxDate ? maxDate * 1000 : undefined,
  })

  React.useEffect(() => {
    let temp = [...data]

    let lastDate = moment.unix(temp[temp.length - 1].date).utc()
    const lastDateOriginal = moment.unix(temp[temp.length - 1].date).utc()

    if (temp?.[temp.length - 2]?.date && temp?.[temp.length - 3]?.date) {
      const lastDate1 = moment.unix(temp[temp.length - 2].date).unix()
      const lastDate2 = moment.unix(temp[temp.length - 3].date).unix()
      lastDate = moment.unix(lastDate1 - lastDate2 + lastDate1)
    } else {
      if (range === Periods.ONE_DAY) {
        lastDate.minutes(Math.ceil(lastDate.minutes() / 15) * 15)
      } else if (range === Periods.ONE_WEEK) {
        lastDate.endOf('hour').add(1, 'minute')
      } else if (range === Periods.THREE_MONTH || range === Periods.ALL) {
        lastDate.startOf('day')
      }
    }

    temp[temp.length - 1] = {
      ...temp[temp.length - 1],
      date: lastDate.unix(),
      temp: lastDateOriginal.unix(),
    } as any

    if (range === 15 && temp.length < POINTS_PER_DAY) {
      temp = fillDay(temp)
    }

    setSeries(
      temp.map((d) => ({
        x: moment.unix(d.date).utc().toDate(),
        temp: (d as any).temp || d.date,
        y: [d.open, d.high, d.low, d.close],
      }))
    )
  }, [data, setSeries, range])

  return (
    <div onMouseLeave={() => onMove(-1)} className="candlestick">
      <Chart
        options={options}
        series={[{ data: series }]}
        type="candlestick"
        height={height - 15}
        width="100%"
      />
    </div>
  )
}

export default CandlestickChart
