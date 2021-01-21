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
  const [type, setType] = React.useState<string>("Line");
  const [closePrice] = React.useState<number>(0.77);

  const { data, loading } = useFetch<HistoryResponse>(
    `https://keyvanafunctions.azurewebsites.net/api/GetItemHistory?interval=${range}&item=SWC`
  );

  return (
    <div className="App">
      <div className="select-container">
        <button
          type="button"
          className={`select-button ${type === "Line" ? "selected" : ""}`}
          onClick={() => setType("Line")}
        >
          Line
        </button>
        <button
          type="button"
          className={`select-button ${type === "Candlestick" ? "selected" : ""}`}
          onClick={() => setType("Candlestick")}
        >
          Candlestick
        </button>
      </div>
      <SparklineChart
        candlestick={type === "Candlestick"}
        stockName={"SWC"}
        data={mapper(data) || []}
        range={range}
        onRange={setRange}
        closePrice={closePrice}
      />
    </div>
  );
}

export default App;
