import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

import type { DataPoint } from '../types';

type Props = {
  data: DataPoint[]

  onDataHover?: (value: number | null) => void
}

const Package: React.FC<Props> = ({ data, onDataHover }) => {

  const max = data.reduce((highest, current) => Math.max(highest, current.high), 0);
  const min = data.reduce((lowest, current) => Math.min(lowest, current.low), 0);

  const onMove = React.useCallback((e: any) => {
    onDataHover?.(e?.activePayload?.[0]?.value || null)
  }, [onDataHover])

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        onMouseMove={onMove}
        onMouseLeave={() => onDataHover?.(null)}
        data={data} margin={{ top: 25, bottom: 25 }}
      >
        <Line
          type="linear"
          dataKey="high"
          strokeWidth={2}
          stroke="#21ce99"
          dot={false}
          activeDot={{ stroke: 'black', strokeWidth: 2, r: 5 }}
          isAnimationActive={true}
        />
        <Tooltip content={<div></div>} />
        <YAxis
          hide={true}
          domain={[min, max]}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Package
