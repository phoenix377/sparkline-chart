import "./App.css";

import SparklineChart, { DataPoint } from "@sparkline/chart";
import React from "react";
import ToggleButton from "react-toggle-button";

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
  const [darkMode, setDarkMode] = React.useState<boolean>(true);
  const [isCandlestick, setIsCandlestick] = React.useState<boolean>(false);

  // const stockName = "AWFFN";
  const stockName = "CS50";
  // const stockName = "SWC";

  const { data } = useFetch<HistoryResponse>(
    `https://keyvanafunctions.azurewebsites.net/api/GetItemHistory?interval=${
      // TODO: 42 is a fake number received from SparklineChart
      range === 42 ? 15 * 96 : range
    }&item=${stockName}`
  );

  const onDarkToggle = React.useCallback(
    (value: boolean) => {
      setDarkMode(!value);
      if (value) {
        document.body.classList.remove("dark");
      } else {
        document.body.classList.add("dark");
      }
    },
    [setDarkMode]
  );

  const mappedData = mapper(data) || [];

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <div className="light-switch-container">
        <div className="light-switch">
          <span>Dark mode</span>
          <ToggleButton value={darkMode} onToggle={onDarkToggle} />
        </div>
      </div>
      <SparklineChart
        light={!darkMode}
        candlestick={isCandlestick}
        onCandlestick={setIsCandlestick}
        stockName={stockName}
        data={mappedData}
        range={range}
        onRange={setRange}
        closePrice={mappedData?.[0]?.close}
      />
    </div>
  );
}

export default App;
