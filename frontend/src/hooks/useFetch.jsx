import { useEffect, useState } from "react"

export default function useFetch(api, filter) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);
    useEffect(() => {
        const newUrl = api + "?" + new URLSearchParams({ status: filter.join() })
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
    }, [api])
    return { loading, error, data };
}
