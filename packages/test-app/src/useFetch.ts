import { useEffect, useState } from "react";

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async (url: string) => {
      try {
        setLoading(true)
        setError(null)
        const temp = await fetch(url)

        setData(await temp.json())
        setLoading(false)
      } catch (e) {
        setError(e.message)
      }
    }
    getData(url)
  }, [setData, url])

  return { data, loading, error }
}
