import { useThrottle } from '@react-hook/throttle';
import React from 'react';

import { getArr } from './utils';

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
  const [zeroWidth, setZeroWidth] = useThrottle(last ? (digit === '0' ? 0 : width) : width, 20, true)

  React.useEffect(() => {
    setOffset(-digit * height)
  }, [digit, setOffset])

  React.useEffect(() => {
    setIsRolling(true)
  }, [setIsRolling])

  React.useEffect(() => {
    setZeroWidth(last ? (digit === '0' ? 0 : width) : width)
  }, [last, digit, setZeroWidth])

  const arr = getArr()
  return (
    <div
      className={`DigitRoll__Slice`}
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

export default Slice;

// export default class Slice extends PureComponent<any> {
//   state = {
//     offset: 0,
//     isRolling: false,
//     prevDigit: 0,
//   }

//   componentDidMount = () => {
//     const { digit, height } = this.props
//     const offset = -digit * height
//     setTimeout(() => {
//       this.setState({ offset, isRolling: true })
//     }, 100)
//   }

//   componentWillReceiveProps = nextProps => {
//     if (nextProps.digit !== this.props.digit) {
//       const offset = -nextProps.digit * this.props.height
//       setTimeout(() => {
//         this.setState({ offset, isRolling: true })
//       }, 100)
//     }
//   }

//   render() {
//     const { width, height, delay, digit } = this.props
//     const { isRolling } = this.state
//     const arr = getArr()
//     console.log(digit, isRolling)
//     return (
//       <div
//         className={`DigitRoll__Slice`}
//         style={{
//           marginTop: this.state.offset + 'rem',
//           transition: isRolling ? `margin ${delay}s ease-in` : '',
//         }}
//       >
//         {arr?.map((d, index) => (
//           <div
//             key={index}
//             className="DigitRoll__Cell"
//             style={{ height: height + 'rem', width: width + 'rem' }}
//           >
//             {d}
//           </div>
//         ))}
//       </div>
//     )
//   }
// }
