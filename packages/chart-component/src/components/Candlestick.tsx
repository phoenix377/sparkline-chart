import moment from 'moment'
import * as React from 'react'
import Chart from 'react-apexcharts'
import { numberFormatter } from '../formatter'

import type { DataPoint } from '../types'
import { getCandlestickOptions } from './chartUtils'

type Props = {
  data: DataPoint[]

  onDataHover?: (value: number | null) => void
  closePrice?: number | null
}

const CandlestickChart: React.FC<Props> = ({ data, onDataHover }) => {
  const [series, setSeries] = React.useState<any[]>([])

  const max = +numberFormatter.format(
    data.reduce((highest, current) => Math.max(highest, current.high), data[0]?.high || 0)
  )
  const min = +numberFormatter.format(
    data.reduce((lowest, current) => Math.min(lowest, current.high), data[0]?.high || 0)
  )

  const dataPointMouseEnter = React.useCallback(
    (_e, _ctx, { dataPointIndex }) => {
      onDataHover?.(data[dataPointIndex].high)
    },
    [onDataHover, data]
  )
  const dataPointMouseLeave = React.useCallback(() => {
    onDataHover?.(null)
  }, [onDataHover])

  const options = getCandlestickOptions({ dataPointMouseEnter, dataPointMouseLeave, min, max })
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
