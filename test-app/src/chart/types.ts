export type DataPoint = {
  date: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type RootProps = {
  data: DataPoint[]
  stockName: string

  refetch?: () => any | Promise<any>
  interval?: number
  height?: number
  light?: boolean
  candlestick?: boolean
  onCandlestick?: (isCandlestick: boolean) => any | Promise<any>
  closePrice?: number
  onRange?: (range: number) => any | Promise<any>
  range?: number
  showName?: boolean
  noCandlestick?: boolean
}
