import moment from 'moment'
import findIndex from 'ramda/src/findIndex'
import findLastIndex from 'ramda/src/findLastIndex'
import * as React from 'react'
import { Customized, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Add, Colors, POINTS_PER_DAY, Subtract } from '../constants'
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
  height?: number
  negativeTrend?: boolean
}

const Chart: React.FC<Props> = ({
  data,
  onDataHover,
  days,
  closePrice,
  range,
  light,
  height = 275,
  negativeTrend = false,
}) => {
  const [periodStart, setPeriodStart] = React.useState(0)
  const [periodEnd, setPeriodEnd] = React.useState(100)

  let max =
    data.reduce((highest, current) => Math.max(highest, current.close), data[0]?.close || 0) *
    Add.TWO_PER_MILLE

  let min =
    data.reduce((lowest, current) => Math.min(lowest, current.close), data[0]?.close || 0) *
    Subtract.TWO_PER_MILLE

  if (closePrice) {
    min = Math.min(min, closePrice)
    max = Math.max(max, closePrice)
  }

  let dataWAvg = data.map((d, idx) => ({ ...d, idx }))

  if (range === 15 && dataWAvg.length < POINTS_PER_DAY) {
    dataWAvg = fillDay(dataWAvg)
  }

  const lines: any[] = []

  if (closePrice) {
    lines.push(avgLine())
  }

  const notSame = data.some((d) => d.close !== data[0].close)

  lines.push(
    chartLine(
      'close',
      days && notSame
        ? 'url(#colorUv)'
        : negativeTrend
        ? Colors.LINE_CHART_NEGATIVE
        : Colors.LINE_CHART,
      light ? Colors.DOT_WHITE_STROKE : Colors.DOT_BLACK_STROKE,
      negativeTrend ? Colors.LINE_CHART_NEGATIVE : Colors.LINE_CHART
    )
  )

  React.useEffect(() => {
    setPeriodStart(0)
    setPeriodEnd(100)
  }, [days])

  const onMove = React.useCallback(
    (e: any) => {
      const payload = e?.activePayload?.find((p) => p.name === 'close')
      onDataHover?.(payload?.value || null)
      if (days) {
        const initial = moment(e?.activePayload?.[0]?.payload?.date * 1000)
          .utc()
          .startOf('day')

        let initialUnix = initial.unix()

        const firstPoint = moment(e?.activePayload?.[0]?.payload?.date * 1000).isSame(initial)

        const lastIndex: number = findLastIndex(
          (d: DataPoint) =>
            moment(d.date * 1000)
              .utc()
              .startOf('day')
              .unix() === initialUnix,
          dataWAvg
        )

        if (firstPoint) {
          initial.subtract(1, 'day')
          initialUnix = initial.unix()
        }

        const firstIndex: number = findIndex(
          (d: DataPoint) =>
            moment(d.date * 1000)
              .utc()
              .startOf('day')
              .unix() === initialUnix,
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
    setPeriodEnd(100)
  }, [onDataHover, setPeriodStart, setPeriodEnd])

  const activeColor = negativeTrend ? Colors.LINE_CHART_NEGATIVE : Colors.LINE_CHART
  // eslint-disable-next-line no-nested-ternary
  const inactiveColor = light
    ? negativeTrend
      ? Colors.LINE_CHART_NEGATIVE_INACTIVE_LIGHT
      : Colors.LINE_CHART_INACTIVE_LIGHT
    : negativeTrend
    ? Colors.LINE_CHART_NEGATIVE_INACTIVE
    : Colors.LINE_CHART_INACTIVE

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data={dataWAvg}
        margin={{ top: 25, bottom: 25 }}
      >
        {closePrice ? (
          <Customized key={range} range={range} value={closePrice} component={ClosePriceLine} />
        ) : null}
        <Tooltip cursor={<CustomizedCursor range={range} stroke="#777" />} content={<div />} />
        <defs>
          <CustomizedColor
            periodStart={periodStart}
            periodEnd={periodEnd}
            color={activeColor}
            inactiveColor={inactiveColor}
          />
        </defs>
        {lines.map((line, idx) => (
          <Line key={idx} {...(line as any)} />
        ))}
        <XAxis hide dataKey="date" padding={{ left: 10, right: 10 }} />
        <YAxis hide domain={[min, max]} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
