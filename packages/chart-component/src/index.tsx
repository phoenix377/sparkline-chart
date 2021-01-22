import './styles.scss'

import { MoonLoader } from 'halogenium'
import React from 'react'

import DigitRoll from './components/Digit'
import LineChart from './components/LineChart'
import { currencyFormatter, getDifference } from './formatter'

import type { RootProps, DataPoint } from './types'
import CandlestickChart from './components/Candlestick'

export { RootProps, DataPoint }

const Package: React.FC<RootProps> = ({
  data,
  loading,
  onRange,
  stockName,
  candlestick,
  onCandlestick,
  range = 15,
  closePrice = 0,
}) => {
  const onSetRange = React.useCallback(
    (v) => {
      onRange?.(v)
    },
    [onRange]
  )

  const [activePrice, setActivePrice] = React.useState<string | null>(null)
  const [activePriceRaw, setActivePriceRaw] = React.useState<number | null>(null)
  const [isCandlestick, setIsCandlestick] = React.useState<boolean>(candlestick || false)
  const maxPriceRaw: number = data?.[data.length - 1]?.high || 0
  const maxPrice = currencyFormatter.format(maxPriceRaw)

  const changeType = React.useCallback(
    (isC) => {
      setIsCandlestick(isC)
      onCandlestick?.(isC)
    },
    [setIsCandlestick, onCandlestick]
  )

  const onDataHover = React.useCallback(
    (v: number | null) => {
      if (v) {
        setActivePrice(currencyFormatter.format(v))
        setActivePriceRaw(v)
      } else {
        setActivePrice(null)
        setActivePriceRaw(null)
      }
    },
    [setActivePrice]
  )

  const ranges = [
    { label: '1D', value: 15 },
    { label: '1W', value: 60 },
    { label: '1M', value: 15 * 32 },
    { label: '3M', value: 15 * 96 },
  ]

  const rangeButtons = ranges.map((r, i) => {
    return (
      <button
        type="button"
        key={i}
        className={`range-buttons ${range === r.value ? 'selected' : ''}`}
        onClick={() => onSetRange(r.value)}
      >
        {r.label}
      </button>
    )
  })

  const typeButtons = (
    <>
      <button
        type="button"
        className={`range-buttons ${!isCandlestick ? 'selected' : ''}`}
        onClick={() => changeType(false)}
      >
        Line
      </button>
      <button
        type="button"
        className={`range-buttons ${isCandlestick ? 'selected' : ''}`}
        onClick={() => changeType(true)}
      >
        Candlestick
      </button>
    </>
  )

  if (loading) {
    return (
      <div className="sparkline-chart">
        <MoonLoader className="loading-icon" color="#26A65B" size="20px" />
      </div>
    )
  }

  const difference = getDifference(activePriceRaw, maxPriceRaw, closePrice)

  const chart = isCandlestick ? (
    <CandlestickChart onDataHover={onDataHover} data={data || []} />
  ) : (
    <LineChart
      closePrice={closePrice && range === 15 ? closePrice : null}
      data={data || []}
      days={range === 60}
      onDataHover={onDataHover}
      range={range}
    />
  )

  return (
    <div className="sparkline-chart">
      <div className="stock-chart">
        <div className="chart">
          <div className="chart-header">
            <h1 className="company-name">{stockName}</h1>
            <div className="stock-chart-price">
              <div className="stock-chart-price--currency">$</div>
              <DigitRoll num={activePrice || maxPrice} />
            </div>
            <div className="">
              <span>{difference}</span>
            </div>
            <div className="percent-change">
              <span className="range" />
            </div>
          </div>
        </div>

        {chart}

        <div className="button-list">
          <div>{rangeButtons}</div>
          <div>{typeButtons}</div>
        </div>
      </div>
    </div>
  )
}

export default Package
