import './default.scss'

import React from 'react'

import Slice from './Slice'
import { formatDigit } from './utils'

type DigitRollProps = {
  num?: string
  height?: number
  width?: number
  delay?: number
  className?: string
}

const Divider = ({ height }: any) => (
  <div style={{ height: `${height}rem` }} className="DigitRoll__Divider">
    .
  </div>
)

const DigitRoll: React.FC<DigitRollProps> = ({
  num = '0',
  height = 3,
  width = 1.2,
  delay = 0.2,
  className = '',
}) => {
  const numArr = formatDigit(num)

  return (
    <div className="DigitRoll__Out" style={{ display: 'inline' }}>
      <div className={`DigitRoll ${className}`} style={{ height: `${height}rem` }}>
        {numArr.map((d: any, index: any) => {
          if (d === '.') {
            return <Divider key={index} height={height} />
          }
          return (
            <Slice
              key={index}
              digit={d}
              height={height}
              width={width}
              delay={delay}
              last={index === numArr.length - 1}
            />
          )
        })}
      </div>
    </div>
  )
}

export default DigitRoll
