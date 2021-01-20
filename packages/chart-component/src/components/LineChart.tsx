import { curveBasis } from 'd3-shape';
import moment from 'moment';
import findIndex from 'ramda/src/findIndex';
import findLastIndex from 'ramda/src/findLastIndex';
import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { numberFormatter } from '../formatter';

import type { DataPoint } from '../types';

const chartLine = (dataKey = "high", stroke = "#21ce99") => ({
  activeDot: { stroke: 'black', fill: '#21ce99', strokeWidth: 2, r: 5 },
  connectNulls: true,
  dataKey,
  dot: false,
  isAnimationActive: true,
  stroke,
  strokeDasharray: "",
  strokeWidth: 2,
  type: curveBasis,
})

const avgLine = (dataKey = "avg") => ({
  activeDot: false,
  connectNulls: true,
  dataKey,
  dot: false,
  isAnimationActive: false,
  stroke: "#4e4e4e",
  strokeDasharray: "2 6",
  strokeWidth: 2,
  type: 'monotone',
})


type Props = {
  data: DataPoint[]

  onDataHover?: (value: number | null) => void
  days?: boolean
}

const Package: React.FC<Props> = ({ data, onDataHover, days }) => {
  const [periodStart, setPeriodStart] = React.useState(0);
  const [periodEnd, setPeriodEnd] = React.useState(days ? 0 : 100);

  const max = +numberFormatter.format(data.reduce((highest, current) => Math.max(highest, current.high), data[0]?.high || 0) * 1.02);
  const min = +numberFormatter.format(data.reduce((lowest, current) => Math.min(lowest, current.high), data[0]?.high || 0) * 0.98);
  const avg = +numberFormatter.format(data.reduce((sum, current) => (sum + current.high), 0) / data.length);

  const dataWAvg = data.map((d, idx) => ({ ...d, avg, idx }))

  const lines: any[] = []

  lines.push(chartLine('high', 'url(#colorUv)'))
  lines.push(avgLine())

  React.useEffect(() => {
    setPeriodStart(0)
    setPeriodEnd(days ? 0 : 100)
  }, [days])

  const onMove = React.useCallback((e: any) => {
    onDataHover?.(e?.activePayload?.[0]?.value || null)
    if (days) {
      const initial = moment(e?.activePayload?.[0]?.payload?.date * 1000).startOf('day').unix()
      const firstIndex: number = findIndex((d: DataPoint) => moment(d.date * 1000).startOf('day').unix() === initial, dataWAvg)
      const lastIndex: number = findLastIndex((d: DataPoint) => moment(d.date * 1000).startOf('day').unix() === initial, dataWAvg)

      setPeriodStart(100 - ((dataWAvg.length - firstIndex - 1) * 100 / (dataWAvg.length - 1)))
      setPeriodEnd(100 - ((dataWAvg.length - lastIndex - 1) * 100 / (dataWAvg.length - 1)))
    }
  }, [dataWAvg, onDataHover, setPeriodStart, setPeriodEnd, days])

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
        <defs>
          <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
            <stop offset={`${0}%`} stopColor="#0e5c43" />
            <stop offset={`${periodStart}%`} stopColor="#0e5c43" />
            <stop offset={`${periodStart}%`} stopColor="#21ce99" />
            <stop offset={`${periodEnd}%`} stopColor="#21ce99" />
            <stop offset={`${periodEnd}%`} stopColor="#0e5c43" />
            <stop offset={`${100}%`} stopColor="#0e5c43" />
          </linearGradient>
        </defs>
        {lines.map(line => (
          <Line {...line as any} />
        ))}
        <Tooltip content={<div></div>} />
        <XAxis
          hide={true}
          dataKey={'date'}
        />
        <YAxis
          hide={true}
          domain={[min, max]}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Package
