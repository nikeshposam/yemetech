export default function Filter({ setFilter }) {
    const setAll = () => {
        setFilter([])
    }
    const toggleFilter = (e) => {
        const val = e.target.name.toUpperCase();
        setFilter((prevState) => {
            const newState = [...prevState];
            if (e.target.checked) {
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
