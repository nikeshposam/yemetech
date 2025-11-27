import type { Status } from "../App";

interface FilterProps {
    setFilter: React.Dispatch<React.SetStateAction<Array<Status> | null>>;
}

export default function Filter({ setFilter }: FilterProps) {
    const setAll = () => {
        setFilter([])
    }
    const toggleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ele = e.target;
        const val = ele.name.toUpperCase() as Status;
        setFilter((prevState: Array<Status> | null) => {
            const newState = [...(prevState || [])];
            if (ele.checked) {
                newState.push(val);
                return newState
            }
            return newState.filter(v => v != val);
        })
    }
    return (
        <fieldset>
            <legend>Filter</legend>
            <input type="checkbox" name='all' onChange={setAll} />
            <label htmlFor="all">All</label>
            <input type="checkbox" name='pending' onChange={toggleFilter} />
            <label htmlFor="pending">Pending</label>
            <input type="checkbox" name="approved" onChange={toggleFilter} />
            <label htmlFor="approved">Approved</label>
            <input type="checkbox" name="rejected" onChange={toggleFilter} />
            <label htmlFor="rejected">Rejected</label>
        </fieldset>
    )
}
