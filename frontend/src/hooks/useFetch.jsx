import { useEffect, useState } from "react"

export default function useFetch(api) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(api)
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
