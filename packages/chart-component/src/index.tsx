import './styles.scss';

import { MoonLoader } from 'halogenium';
import * as React from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { currencyFormatter } from './formatter'

const generateData = (count: number) => {
  return new Array(count).fill(null).reduce((pr) => {
    return [
      ...pr, Math.max(pr[pr.length - 1] + (Math.random() * 30 - 15.2), 1)
    ]
  }, [100]).map((v: number) => ({ high: v }))
}

const Package: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(generateData(150))

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500)
  }, [])

  const regenerate = React.useCallback(() => {
    setData(generateData(150))
  }, [setData])


  // [100, 200, 120, 210, 220, 180].map(v => ({ high: v }));
  const max = data.reduce((a: number, b: number) => Math.max(a, b), 0);
  const min = data.reduce((a: number, b: number) => Math.min(a, b), 0);
  // const price = `$${this.props.price}`;
  const price = currencyFormatter.format(data[data.length - 1].high)
  const ranges = ['1D', '1M', '3M', '1Y', '2Y', '5Y'];
  const rangeButtons = ranges.map((range: string, i) => {
    return <button
      key={i}
      onClick={regenerate}
      className="range-buttons"
    >
      {range}
    </button>
  });


  return (
    <div className="sparkline-chart">{
      loading ?
        <div>
          <MoonLoader
            className="loading-icon"
            color="#26A65B"
            size="20px"
          />
        </div>
        :


        <div className="stock-chart">

          <div className="chart">
            <div className="chart-header">
              <ul className="tags">
                <li className="tag">Computer Hardware</li>
                <li className="tag">100 Most Popular</li>
                <li className="tag">Computer Software</li>
              </ul>
              <h1 className="company-name">Apple</h1>
              <div className="stock-chart-price">{price}</div>
              <div className="percent-change">
                <span className="range"></span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 25, bottom: 25 }} >
              <Line
                type="linear"
                dataKey="high"
                strokeWidth={2} stroke="#21ce99"
                dot={false}
                isAnimationActive={true}
              />

              <YAxis
                hide={true}
                domain={[min, max]}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="button-list">
            <ul>{rangeButtons}</ul>
          </div>
        </div>}
    </div>)
}

export default Package
