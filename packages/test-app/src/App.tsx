import "./App.css";

import SparklineChart, { DataPoint } from "@sparkline/chart";
import React from "react";

import { useFetch } from "./useFetch";

type HistoryResponse = {
  history: {
    [time: string]: number[];
  };
  interval: string;
  item: string;
};

const mapper = (data?: HistoryResponse | null): DataPoint[] | null => {
  if (!data) {
    return null;
  }
  const temp = Object.keys(data?.history || {}).map((p) => {
    const [open, high, low, close, volume] = data?.history?.[p] || [];
    return {
      open: open / 100,
      high: high / 100,
      low: low / 100,
      close: close / 100,
      volume,
      date: parseInt(p),
    } as DataPoint;
  });

  return temp;
};

function App() {
  const [range, setRange] = React.useState<number>(60);
  const [isCandlestick, setIsCandlestick] = React.useState<boolean>(false);

  const { data } = useFetch<HistoryResponse>(
    `https://keyvanafunctions.azurewebsites.net/api/GetItemHistory?interval=${range}&item=SWC`
  );

  const mappedData = mapper(data) || [];

  return (
    <div className="App">
      <SparklineChart
        candlestick={isCandlestick}
        onCandlestick={setIsCandlestick}
        stockName={"SWC"}
        data={mappedData}
        range={range}
        onRange={setRange}
        closePrice={mappedData?.[0]?.close}
      />
    </div>
  );
}

export default App;
