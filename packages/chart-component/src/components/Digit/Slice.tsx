import { useThrottle } from '@react-hook/throttle'
import React from 'react'

import { getArr } from './utils'

type SliceProps = {
  digit: string
  height: number
  width: number
  delay: number
  last?: boolean
}

const Slice: React.FC<SliceProps> = ({ delay, height, width, digit, last }) => {
  const [offset, setOffset] = useThrottle(-digit * height, 20, true)
  const [isRolling, setIsRolling] = React.useState<boolean>(false)
  const [zeroWidth, setZeroWidth] = useThrottle(
    // eslint-disable-next-line no-nested-ternary
    last ? (digit === '0' ? 0 : width) : width,
    20,
    true
  )

  React.useEffect(() => {
    setOffset(-digit * height)
  }, [digit, setOffset, height])

  React.useEffect(() => {
    setIsRolling(true)
  }, [setIsRolling])

  React.useEffect(() => {
    // eslint-disable-next-line no-nested-ternary
    setZeroWidth(last ? (digit === '0' ? 0 : width) : width)
  }, [last, digit, setZeroWidth, width])

  const arr = getArr()
  return (
    <div
      className="DigitRoll__Slice"
      style={{
        marginTop: `${offset}rem`,
        width: `${zeroWidth}rem`,
        transition: isRolling ? `width,margin ${delay}s ease-in` : '',
      }}
    >
      {arr?.map((d, index) => (
        <div
          key={index}
          className="DigitRoll__Cell"
          style={{ height: `${height}rem`, width: `${width}rem` }}
        >
          {d}
        </div>
      ))}
    </div>
  )
}

export default Slice
