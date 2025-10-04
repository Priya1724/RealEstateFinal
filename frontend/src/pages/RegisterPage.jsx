import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useState } from 'react';

const validationSchema = Yup.object({
  name: Yup.string().min(3, 'Name is too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password')
});

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Create your RealNest account</h2>
            <p className="text-muted">List properties, manage leads, and connect with buyers.</p>

            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={async ({ name, email, password }, { setSubmitting }) => {
                setFormError(null);
                try {
                  await register({ name, email, password });
                  navigate('/dashboard', { replace: true });
                } catch (err) {
                  setFormError(err.response?.data?.message || 'Unable to register');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  {formError && <div className="alert alert-danger">{formError}</div>}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                      Full name
                    </label>
                    <Field name="name" type="text" className="form-control" />
                    <ErrorMessage component="div" className="form-error" name="name" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email address
                    </label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage component="div" className="form-error" name="email" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <Field name="password" type="password" className="form-control" />
                    <ErrorMessage component="div" className="form-error" name="password" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm password
                    </label>
                    <Field name="confirmPassword" type="password" className="form-control" />
                    <ErrorMessage component="div" className="form-error" name="confirmPassword" />
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-3 mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
