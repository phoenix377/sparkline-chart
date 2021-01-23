import './styles.scss'

import { MoonLoader } from 'halogenium'
import React from 'react'
import ToggleButton from 'react-toggle-button'

import CandlestickChart from './components/Candlestick'
import DigitRoll from './components/Digit'
import LineChart from './components/LineChart'
import RangeButton from './components/RangeButton'
import { Colors, Periods, PeriodsLabels } from './constants'
import { currencyFormatter, getDifference, pastPeriodLabel } from './formatter'

import type { RootProps, DataPoint } from './types'

export { RootProps, DataPoint }

const Package: React.FC<RootProps> = ({
  data,
  loading,
  light = false,
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
    { label: PeriodsLabels.ONE_DAY, value: Periods.ONE_DAY },
    { label: PeriodsLabels.ONE_WEEK, value: Periods.ONE_WEEK },
    { label: PeriodsLabels.ONE_MONTH, value: Periods.ONE_MONTH },
    { label: PeriodsLabels.THREE_MONTH, value: Periods.THREE_MONTH },
    { label: PeriodsLabels.ALL, value: Periods.ALL },
  ]

  const rangeButtons = ranges.map((r, i) => {
    return (
      <RangeButton key={i} selected={range === r.value} onClick={() => onSetRange(r.value)}>
        {r.label}
      </RangeButton>
    )
  })

  const typeButtons = (
    <div className="toggle-candle">
      <span>Candlestick</span>
      <ToggleButton
        value={isCandlestick}
        onToggle={(value) => {
          changeType(!value)
        }}
      />
    </div>
  )

  if (loading) {
    return (
      <div className="sparkline-chart">
        <MoonLoader className="loading-icon" color="#26A65B" size="20px" />
      </div>
    )
  }

  const difference = getDifference(activePriceRaw, maxPriceRaw, closePrice) || ''

  const chart = isCandlestick ? (
    <CandlestickChart range={range} onDataHover={onDataHover} data={data || []} />
  ) : (
    <LineChart
      closePrice={closePrice && range === 15 ? closePrice : null}
      data={data || []}
      days={range === 60}
      onDataHover={onDataHover}
      range={range}
      light={light}
    />
  )

  return (
    <div className={`sparkline-chart ${light ? 'light' : ''}`}>
      <div className="stock-chart">
        <div className="chart">
          <div className="chart-header">
            <h1 className="company-name">{stockName}</h1>
            <div className="stock-chart-price">
              <div className="stock-chart-price--currency">$</div>
              <DigitRoll num={activePrice || maxPrice} />
            </div>
            <div className="">
              <span
                style={{
                  color: difference.startsWith('-') ? Colors.RED : Colors.GREEN,
                }}
              >
                {difference} {pastPeriodLabel(range)}
              </span>
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
