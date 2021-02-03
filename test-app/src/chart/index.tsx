import './styles.scss'

import React from 'react'
import ToggleButton from 'react-toggle-button'

import CandlestickChart from './components/Candlestick'
import DigitRoll from './components/Digit'
import LineChart from './components/LineChart'
import RangeButton from './components/RangeButton'
import { Colors, Periods, PeriodsLabels, SECOND } from './constants'
import { currencyFormatter, getDifference, pastPeriodLabel } from './formatter'

import type { RootProps, DataPoint } from './types'

export type { RootProps, DataPoint }

const Package: React.FC<RootProps> = ({
  data,
  light = false,
  onRange,
  stockName,
  candlestick,
  onCandlestick,
  range = 15,
  closePrice = 0,
  height = 275,
  showName = false,
  interval = 4,
  refetch = null,
  noCandlestick = false,
}) => {
  React.useEffect(() => {
    if (refetch) {
      const timer = setInterval(() => {
        refetch()
      }, interval * SECOND)

      return () => {
        clearInterval(timer)
      }
    }
    return () => null
  }, [interval, refetch])

  const onSetRange = React.useCallback(
    (v) => {
      onRange?.(v)
    },
    [onRange]
  )

  const [activePrice, setActivePrice] = React.useState<string | null>(null)
  const [activePriceRaw, setActivePriceRaw] = React.useState<number | null>(null)
  const [isCandlestick, setIsCandlestick] = React.useState<boolean>(candlestick || false)
  const lastPriceRaw: number = data?.[data.length - 1]?.close || 0
  const firstPriceRaw: number = data?.[0]?.close || 0
  const maxPrice = currencyFormatter.format(lastPriceRaw)

  const negativeTrend = lastPriceRaw < firstPriceRaw

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
      <RangeButton
        key={i}
        selected={range === r.value}
        onClick={() => onSetRange(r.value)}
        negative={negativeTrend}
      >
        {r.label}
      </RangeButton>
    )
  })

  const typeButtons = noCandlestick ? null : (
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

  const difference = getDifference(activePriceRaw, lastPriceRaw, closePrice) || ''

  const chart = isCandlestick ? (
    <CandlestickChart range={range} onDataHover={onDataHover} data={data || []} height={height} />
  ) : (
    <LineChart
      closePrice={closePrice && range === 15 ? closePrice : null}
      data={data || []}
      days={range === 60}
      onDataHover={onDataHover}
      range={range}
      light={light}
      height={height}
      negativeTrend={negativeTrend}
    />
  )

  return (
    <div className={`sparkline-chart ${light ? 'light' : ''}`}>
      <div className="stock-chart">
        <div className="chart">
          <div className="chart-header">
            {showName ? <h1 className="company-name">{stockName}</h1> : null}
            <div className="stock-chart-price">
              <div className="stock-chart-price--currency">$</div>
              <DigitRoll num={activePrice || maxPrice} />
            </div>
            <div className="difference-indicator-container">
              <span
                className="difference-indicator"
                style={{
                  color: difference.startsWith('-') ? Colors.RED : Colors.GREEN,
                }}
              >
                {difference}
              </span>
              <span className="difference-indicator-period"> {pastPeriodLabel(range)}</span>
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
