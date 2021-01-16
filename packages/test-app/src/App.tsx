import './App.css';

import SparklineChart, { DataPoint } from '@sparkline/chart';
import React from 'react';

import { useFetch } from './useFetch';

type HistoryResponse = {
  history: {
    [time: string]: number[]
  }
  interval: string
  item: string
}

const mapper = (data?: HistoryResponse | null): DataPoint[] | null => {
  if (!data) {
    return null
  }
  const temp = Object.keys(data?.history || {}).map(p => {
    const [open, high, low, close, volume] = data?.history?.[p] || [];
    return { open, high, low, close, volume, date: parseInt(p) } as DataPoint;
  })

  return temp
}

function App() {
  const [range, setRange] = React.useState<number>(15)

  const { data, loading } = useFetch<HistoryResponse>(`https://keyvanafunctions.azurewebsites.net/api/GetItemHistory?interval=${range}&item=SWC`)

  return (
    <div className="App">
      <SparklineChart
        stockName={'SWC'}
        loading={loading}
        data={mapper(data) || []}
        range={range}
        onRange={setRange}
      />
    </div>
  );
}

export default App;
