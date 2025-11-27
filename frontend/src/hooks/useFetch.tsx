import { useEffect, useState } from "react"
import type { Status } from "../App";

interface FetchResult<T> {
    data: T | null,
    loading: boolean,
    error: boolean
}

export default function useFetch<T>(api: URL | string, filter: Array<Status> | null): FetchResult<T> {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState<T | null>(null);
    useEffect(() => {
        const newUrl = api + "?" + new URLSearchParams({ status: filter?.join() || "" })
        fetch(newUrl)
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => {
                console.error(err);
                setError(true)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [api, filter])
    return { loading, error, data };
}
