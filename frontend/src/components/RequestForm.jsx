import { object, string } from "yup";
import { Formik, Form, Field } from 'formik';

const validation = object({
    email: string().email().required(),
    resource: string().required(),
    reason: string().required()
})

export default function RequestForm({ addRequest }) {
    const initState = { email: "", resource: "", reason: "" };
    return (
        <Formik initialValues={initState} onSubmit={addRequest} validationSchema={validation}>
            {({ errors, isSubmitting }) => (
                <Form className='request-form'>
                    <label htmlFor='email'>Email</label>
                    <Field type='text' name='email' placeholder="Enter email" className={errors.email ? "danger" : ""} />
                    <label htmlFor='resource'>Resource</label>
                    <Field type='text' name='resource' placeholder="Enter resource" className={errors.resource ? "danger" : ""} />
                    <label htmlFor='reason'>Reason</label>
                    <Field type='text' name='reason' placeholder="Enter reason" className={errors.reason ? "danger" : ""} />
                    <button type='submit' disbled={isSubmitting}>Add</button>
                </Form>
            )}
        </Formik>
    )
}
