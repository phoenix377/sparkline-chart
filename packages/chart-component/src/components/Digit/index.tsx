import './default.scss';

import React, { PureComponent } from 'react';

import Slice from './Slice';
import { formatDigit } from './utils';

export default class DigitRoll extends PureComponent<any> {
  render() {
    const { num, length, height = 3, width = 1.25, divider = '', delay = 0.2, className = '' } = this.props
    const numArr = formatDigit(num, length, divider)
    const validDivider =
      divider !== undefined &&
      (typeof divider === 'string' || typeof divider === 'number')
    return (
      <div className="DigitRoll__Out" style={{ display: 'inline' }}>
        <div className={`DigitRoll ${className}`} style={{ height: height + 'rem' }}>
          {numArr.map((d: any, index: any) => {
            if (validDivider && index % 4 === 3) {
              return <Divider key={index} divider={divider} height={height} />
            }
            return (
              <Slice key={index} digit={d} height={height} width={width} delay={delay} />
            )
          })}
        </div>
      </div>
    )
  }
}

const Divider = ({ divider, height }: any) => (
  <div style={{ height: height + 'rem' }} className="DigitRoll__Divider">
    {divider}
  </div>
)
