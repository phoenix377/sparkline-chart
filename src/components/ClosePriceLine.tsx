import * as React from 'react'

const ClosePriceLine: React.FC<any> = (props) => {
  const width = 1
  const gap = (props.width - 20 + width - props.data.length * width) / (props.data.length - 1)
  const y = props?.yAxisMap[0]?.scale(props.value) - 1

  return (
    <g>
      {props.data.map((_, idx) => (
        <rect
          key={`cursor-${props.range}-${idx}`}
          y={y}
          x={10 + idx * (gap + width) - width / 2}
          width={width}
          height={width}
          fill={props.stroke || '#777'}
        />
      ))}
    </g>
  )
}

export default ClosePriceLine
