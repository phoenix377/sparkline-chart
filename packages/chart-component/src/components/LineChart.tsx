import moment from 'moment'
import findIndex from 'ramda/src/findIndex'
import findLastIndex from 'ramda/src/findLastIndex'
import * as React from 'react'
import { Customized, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Add, Colors, Subtract } from '../constants'
import { avgLine, chartLine, fillDay } from './chartUtils'
import ClosePriceLine from './ClosePriceLine'
import CustomizedColor from './CustomizedColor'
import CustomizedCursor from './CustomizedCursor'

import type { DataPoint } from '../types'

type Props = {
  data: DataPoint[]

  range?: number | null
  light?: boolean
  onDataHover?: (value: number | null) => void
  days?: boolean
  closePrice?: number | null
}

const Chart: React.FC<Props> = ({ data, onDataHover, days, closePrice, range, light }) => {
  const [periodStart, setPeriodStart] = React.useState(0)
  const [periodEnd, setPeriodEnd] = React.useState(days ? 0 : 100)

  let max =
    data.reduce((highest, current) => Math.max(highest, current.high), data[0]?.high || 0) *
    Add.TWO_PER_MILLE

  let min =
    data.reduce((lowest, current) => Math.min(lowest, current.high), data[0]?.high || 0) *
    Subtract.TWO_PER_MILLE

  if (closePrice) {
    min = Math.min(min, closePrice)
    max = Math.max(max, closePrice)
  }

  let dataWAvg = data.map((d, idx) => ({ ...d, idx }))

  if (range === 15 && dataWAvg.length < 96) {
    dataWAvg = fillDay(dataWAvg)
  }

  const lines: any[] = []

  if (closePrice) {
    lines.push(avgLine())
  }

  lines.push(
    chartLine('high', 'url(#colorUv)', light ? Colors.DOT_WHITE_STROKE : Colors.DOT_BLACK_STROKE)
  )

  React.useEffect(() => {
    setPeriodStart(0)
    setPeriodEnd(days ? 0 : 100)
  }, [days])

  const onMove = React.useCallback(
    (e: any) => {
      const payload = e?.activePayload?.find((p) => p.name === 'high')
      onDataHover?.(payload?.value || null)
      if (days) {
        const initial = moment(e?.activePayload?.[0]?.payload?.date * 1000)
          .utc()
          .startOf('day')
          .unix()
        const firstIndex: number = findIndex(
          (d: DataPoint) =>
            moment(d.date * 1000)
              .utc()
              .startOf('day')
              .unix() === initial,
          dataWAvg
        )
        const lastIndex: number = findLastIndex(
          (d: DataPoint) =>
            moment(d.date * 1000)
              .utc()
              .startOf('day')
              .unix() === initial,
          dataWAvg
        )

        setPeriodStart(100 - ((dataWAvg.length - firstIndex - 1) * 100) / (dataWAvg.length - 1))
        setPeriodEnd(100 - ((dataWAvg.length - lastIndex - 1) * 100) / (dataWAvg.length - 1))
      }
    },
    [dataWAvg, onDataHover, setPeriodStart, setPeriodEnd, days]
  )

  const onLeave = React.useCallback(() => {
    onDataHover?.(null)
    setPeriodStart(0)
    setPeriodEnd(days ? 0 : 100)
  }, [days, onDataHover, setPeriodStart, setPeriodEnd])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data={dataWAvg}
        margin={{ top: 25, bottom: 25 }}
      >
        {closePrice ? <Customized value={closePrice} component={ClosePriceLine} /> : null}
        <Tooltip cursor={<CustomizedCursor range={range} stroke="#777" />} content={<div />} />
        <defs>
          <CustomizedColor
            periodStart={periodStart}
            periodEnd={periodEnd}
            inactiveColor={light ? Colors.LINE_CHART_INACTIVE_LIGHT : Colors.LINE_CHART_INACTIVE}
          />
        </defs>
        {lines.map((line, idx) => (
          <Line key={idx} {...(line as any)} />
        ))}
        <XAxis hide dataKey="date" />
        <YAxis hide domain={[min, max]} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
