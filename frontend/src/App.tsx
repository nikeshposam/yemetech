import { useEffect, useReducer, useState, type ReactElement } from 'react'
import useFetch from './hooks/useFetch';
import RequestForm, { type SaveResource } from './components/RequestForm';
import Filter from './components/Filter';
import { isEmpty } from 'radash';
import moment from 'moment';
import type { FormikHelpers } from 'formik';

export type Status = "PENDING" | "APPROVED" | "REJECTED";

export interface Resource {
  id: number;
  email: string;
  resource: string;
  reason: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export type PartialResource = Partial<Resource>

type ResourceAction = { type: "ADD" | "UPDATE", payload: Resource }
  | { type: "INIT", payload: Array<Resource> | null }

const reducer = (state: Array<Resource>, action: ResourceAction) => {
  switch (action.type) {
    case "INIT":
      return [...(action.payload || [])]
    case "ADD": {
      return [...state, action.payload];
    }
    case "UPDATE": {
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

function App(): ReactElement {
  const [filter, setFilter] = useState<Array<Status> | null>(null);
  const { data, error, loading } = useFetch<Array<Resource>>(`${import.meta.env.VITE_API_URL}/requests`, filter);
  const [request, dispatch] = useReducer(reducer, []);

  const addRequest = (values: SaveResource, action: FormikHelpers<SaveResource>) => {
    fetch(`${import.meta.env.VITE_API_URL}/requests`, { method: "POST", body: JSON.stringify(values), headers: { "Content-type": "application/json" } })
      .then(data => data.json())
      .then(data => dispatch({ type: "ADD", payload: data }))
      .then(() => action.resetForm())
      .catch(err => console.error(err))
  }

  const updateRequest = (id: number, status: Status) => () => {
    fetch(`${import.meta.env.VITE_API_URL}/requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Content-type": "application/json" } })
      .then(data => data.json())
      .then(data => dispatch({ type: "UPDATE", payload: data }))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    if (!loading && !error) { dispatch({ type: "INIT", payload: data }) }
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
              {request.filter(r => isEmpty(filter) || filter?.includes(r.status)).map((r, index) => {
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
