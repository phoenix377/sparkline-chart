import React from 'react';

export const useFetch = <T>(url: string) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const makeRequest = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const temp = await fetch(url)

      setData(await temp.json())
      setLoading(false)
    } catch (e) {
      setError(e.message)
    }
  }, [setLoading, setError, setData, url])

  React.useEffect(() => {
    makeRequest()
  }, [setData, url, makeRequest])

  return { data, loading, error, refetch: makeRequest }
}
