import { useEffect, useReducer, useState } from 'react'
import moment from 'moment/moment';
import './App.css'
import Filter from './components/Filter';
import useFetch from './hooks/useFetch';
import RequestForm from './components/RequestForm';
import { isEmpty } from 'radash'

const reducer = (state, action) => {
  switch (action.type) {
    case "init":
      return [...action.payload]
    case "add": {
      return [...state, action.payload];
    }
    case "update": {
      const index = state.findIndex(s => action.payload.id == s.id);
      const state_ = [...state];
      state_[index] = action.payload;
      return state_;
    }
    default:
      console.error("Invalid action")
      return state
  }
}

function App() {
  const [filter, setFilter] = useState([]);
  const { data, error, loading } = useFetch("api/requests", filter);
  const [request, dispatch] = useReducer(reducer, []);

  const addRequest = (values, { resetForm }) => {
    fetch("api/requests", { method: "POST", body: JSON.stringify(values), headers: { "Content-type": "application/json" } })
      .then(data => data.json())
      .then(data => dispatch({ type: "add", payload: data }))
      .then(() => resetForm())
      .catch(err => console.error(err))
  }

  const updateRequest = (id, status) => () => {
    fetch(`api/requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Content-type": "application/json" } })
      .then(data => data.json())
      .then(data => dispatch({ type: "update", payload: data }))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    if (!loading && !error) { dispatch({ type: "init", payload: data }) }
  }, [data, error, loading])

  return (
    <div className='main'>
      <RequestForm addRequest={addRequest} />
      <div>
        <Filter setFilter={setFilter} />
        {loading ? "Loading..." :
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Resource</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {request.filter(r => isEmpty(filter) || filter.includes(r.status)).map((r, index) => {
                const disableButton = r.status != 'PENDING';
                return <tr key={index}>
                  <td>{r.email}</td>
                  <td>{r.resource}</td>
                  <td>{r.reason}</td>
                  <td>{r.status}</td>
                  <td>{moment(r.createdAt).format("DD-MM-YYYY HH:mm:ss")}</td>
                  <td>
                    <button type='button' disabled={disableButton} onClick={updateRequest(r.id, "APPROVED")}>Approve</button>
                    <button type='button' disabled={disableButton} onClick={updateRequest(r.id, "REJECTED")}>Reject</button>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        }
      </div>
    </div >
  )
}

export default App
