import './styles.scss';

import { MoonLoader } from 'halogenium';
import React from 'react';

import DigitRoll from './components/Digit';
import LineChart from './components/LineChart';
import { currencyFormatter, number2Formatter } from './formatter';

import type { RootProps, DataPoint } from './types';
export { RootProps, DataPoint };

const Package: React.FC<RootProps> = ({
  data,
  loading,
  onRange,
  range = 15,
  stockName,
}) => {
  const onSetRange = React.useCallback((v) => {
    onRange?.(v)
  }, [onRange])

  const [activePrice, setActivePrice] = React.useState<string | null>(null)
  const [activePriceRaw, setActivePriceRaw] = React.useState<number | null>(null)
  const maxPriceRaw: number = data?.[data.length - 1]?.high || 0
  const maxPrice = currencyFormatter.format(maxPriceRaw)

  const onDataHover = React.useCallback((v: number | null) => {
    if (v) {
      setActivePrice(currencyFormatter.format(v))
      setActivePriceRaw(v)
    } else {
      setActivePrice(null)
      setActivePriceRaw(null)
    }
  }, [setActivePrice])

  const ranges = [
    { label: '1D', value: 15 },
    { label: '1W', value: 60 },
    { label: '1M', value: 15 * 32 },
    { label: '3M', value: 15 * 96 },
  ];

  const rangeButtons = ranges.map((r, i) => {
    return <button
      key={i}
      className={`range-buttons ${range === r.value ? 'selected' : ''}`}
      onClick={() => onSetRange(r.value)}
    >
      {r.label}
    </button>
  });

  if (loading) {
    return (
      <div className="sparkline-chart">
        <MoonLoader
          className="loading-icon"
          color="#26A65B"
          size="20px"
        />
      </div>
    )
  }

  let difference: string | null = null
  const differenceRaw = (activePriceRaw || maxPriceRaw) - maxPriceRaw
  const differencePercentRaw = ((activePriceRaw || maxPriceRaw) / maxPriceRaw * 100) - 100
  const differencePercent = `${differencePercentRaw > 0 ? '+' : ''}${number2Formatter.format(differencePercentRaw)}%`
  difference = `${currencyFormatter.format(differenceRaw)} (${differencePercent})`
  if (!difference.startsWith('-') && differenceRaw) {
    difference = `+${difference}`
  }

  return (
    <div className="sparkline-chart">
      <div className="stock-chart">
        <div className="chart">
          <div className="chart-header">
            <h1 className="company-name">{stockName}</h1>
            {/* <div className="stock-chart-price">{activePrice || maxPrice}</div> */}
            <div className="stock-chart-price">
              <div className="stock-chart-price--currency">$</div><DigitRoll num={activePrice || maxPrice} />
            </div>
            <div className="">
              <span>{difference}</span>
            </div>
            <div className="percent-change">
              <span className="range"></span>
            </div>
          </div>
        </div>
        <LineChart onDataHover={onDataHover} data={data || []} days={range === 60} />
        <div className="button-list">
          <ul>{rangeButtons}</ul>
        </div>
      </div>
    </div>
  )
}

export default Package
