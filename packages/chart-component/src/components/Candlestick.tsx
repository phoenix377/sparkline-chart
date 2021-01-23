import moment from 'moment'
import * as React from 'react'
import Chart from 'react-apexcharts'

import { Add, Subtract } from '../constants'
import { numberFormatter } from '../formatter'
import { getCandlestickOptions, minimalUnit } from './chartUtils'

import type { DataPoint } from '../types'

type Props = {
  data: DataPoint[]

  range?: number | null
  onDataHover?: (value: number | null) => void
  closePrice?: number | null
}

const CandlestickChart: React.FC<Props> = ({ data, onDataHover, range }) => {
  const [series, setSeries] = React.useState<any[]>([])

  const max = +numberFormatter.format(
    data.reduce((highest, current) => Math.max(highest, current.high), data[0]?.high || 0) *
      Add.TWO_PERCENT
  )
  const min = +numberFormatter.format(
    data.reduce((lowest, current) => Math.min(lowest, current.high), data[0]?.high || 0) *
      Subtract.TWO_PERCENT
  )

  let minDate: number | null = null
  let maxDate: number | null = null

  if (data.length < 35) {
    minDate =
      data.reduce((lowest, current) => Math.min(lowest, current.date), data[0]?.date || 0) -
      minimalUnit(range || 0)

    maxDate =
      data.reduce((highest, current) => Math.max(highest, current.date), data[0]?.date || 0) +
      minimalUnit(range || 0)
  }

  const onMove = React.useCallback(
    (idx) => {
      onDataHover?.(data?.[idx]?.high || null)
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
    setSeries(
      data.map((d) => ({
        x: moment.unix(d.date).utc().toDate(),
        y: [d.open, d.high, d.low, d.close],
      }))
    )
  }, [data, setSeries])

  return (
    <div className="candlestick">
      <Chart
        options={options}
        series={[{ data: series }]}
        type="candlestick"
        height="260"
        width="100%"
      />
    </div>
  )
}

export default CandlestickChart
