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

  const max =
    data.reduce((highest, current) => Math.max(highest, current.open), data[0]?.open || 0) *
    Add.FOUR_PER_MILLE

  const min =
    data.reduce((lowest, current) => Math.min(lowest, current.close), data[0]?.close || 0) *
    Subtract.FOUR_PER_MILLE

  let minDate: number | null = null
  let maxDate: number | null = null

  minDate =
    series.reduce((lowest, current) => Math.min(lowest, current.temp), series[0]?.temp || 0) -
    minimalUnit(range || 0, data.length)

  maxDate =
    series.reduce((highest, current) => Math.max(highest, current.temp), series[0]?.temp || 0) +
    minimalUnit(range || 0, data.length)

  const onMove = React.useCallback(
    (idx) => {
      onDataHover?.(data?.[idx]?.close || null)
    },
    [onDataHover, data]
  )

  const options = getCandlestickOptions({
    onIndexHover: onMove,
    min,
    max,
    range,
    startDate: minDate ? minDate * 1000 : undefined,
    endDate: maxDate ? maxDate * 1000 : undefined,
  })

  React.useEffect(() => {
    let temp = [...data]

    const lastDate = moment.unix(temp[temp.length - 1].date).utc()
    const lastDateOriginal = moment.unix(temp[temp.length - 1].date).utc()

    if (range === Periods.ONE_DAY) {
      lastDate.minutes(Math.ceil(lastDate.minutes() / 15) * 15)
    } else if (range === Periods.ONE_WEEK) {
      lastDate.endOf('hour').add(1, 'minute')
    } else if (range === Periods.THREE_MONTH || range === Periods.ALL) {
      lastDate.endOf('day').add(1, 'minute')
    } else if (range === Periods.ONE_MONTH) {
      lastDate.endOf('day').add(1, 'minute')
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
    <div className="candlestick">
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
