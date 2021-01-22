import moment from 'moment'
import * as React from 'react'

import { dateFormat } from './chartUtils'

const CustomizedCursor: React.FC<any> = (props) => {
  const x = props?.points?.[0]?.x || 0
  const format = dateFormat(props.range)
  const date = props?.payload?.[0]?.payload?.date || 0
  const displayDate = moment.unix(date).utc().format(format)
  const textWidth = 8 * displayDate.length
  return (
    <g>
      <rect height={props.height + 2} y={23} width={1} fill={props.stroke} x={x - 1 / 2} />
      <text
        x={Math.max(Math.min(x, props.width - textWidth / 2), textWidth / 2)}
        y={10}
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize="15"
        fill={props.textColor || '#ccc'}
      >
        {displayDate}
      </text>
    </g>
  )
}

export default CustomizedCursor
