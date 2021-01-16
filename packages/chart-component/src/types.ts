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

  loading?: boolean
  onRange?: (range: number) => any | Promise<any>
  range?: number
}
