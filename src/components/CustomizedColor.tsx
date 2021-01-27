import * as React from 'react'

import { Colors } from '../constants'

type CustomizedColorProps = {
  periodStart?: number
  periodEnd?: number
  color?: string
  inactiveColor?: string
}

const CustomizedColor: React.FC<CustomizedColorProps> = ({
  periodStart = 0,
  periodEnd = 100,
  color = Colors.LINE_CHART,
  inactiveColor = Colors.LINE_CHART_INACTIVE,
}) => {
  return (
    <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
      <stop offset={`${0}%`} stopColor={inactiveColor} />
      <stop offset={`${periodStart}%`} stopColor={inactiveColor} />
      <stop offset={`${periodStart}%`} stopColor={color} />
      <stop offset={`${periodEnd}%`} stopColor={color} />
      <stop offset={`${periodEnd}%`} stopColor={inactiveColor} />
      <stop offset={`${100}%`} stopColor={inactiveColor} />
    </linearGradient>
  )
}

export default CustomizedColor
