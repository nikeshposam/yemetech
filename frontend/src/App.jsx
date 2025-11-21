import { useEffect, useReducer, useState } from 'react'
import { Formik, Form, Field } from 'formik';
import moment from 'moment/moment';
import './App.css'
import Filter from './components/Filter';
import useFetch from './hooks/useFetch';

const reducer = (state, action) => {
  switch (action.type) {
    case "init":
      return [...action.payload]
    case "add":
      return [...state, action.payload]
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
  const initState = { email: "", resource: "", reason: "" };
  const { data, error, loading } = useFetch("api/requests");
  const [request, dispatch] = useReducer(reducer, []);
  const [filter, setFilter] = useState({ pending: false, approved: false, rejected: false });

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
      <div>
        <Formik initialValues={initState} onSubmit={addRequest}>
          {({ isSubmitting }) => (
            <Form className='request-form'>
              <Field type='text' name='email' />
              <Field type='text' name='resource' />
              <Field type='text' name='reason' />
              <button type='submit' disbled={isSubmitting}>Add</button>
            </Form>
          )}
        </Formik>
        <Filter setFilter={setFilter} />
      </div>
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
            {request.map((r, index) => {
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
    </div >
  )
}

export default App
