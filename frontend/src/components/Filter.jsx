export default function Filter({ setFilter }) {
    const setAll = () => {
        setFilter((filter) => {
            const newFilter = {};
            for (const key in filter) {
                newFilter[key] = true;
            }
            return newFilter
        })
    }
    const toggleFilter = (e) => {
        setFilter((filter) => ({
            ...filter,
            [e.target.name]: e.target.checked
        }))
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
