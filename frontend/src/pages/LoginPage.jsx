import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { useState } from 'react';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState(null);

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Welcome back</h2>
            <p className="text-muted">Enter your credentials to access your dashboard.</p>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setFormError(null);
                try {
                  await login(values);
                  const redirectTo = location.state?.from?.pathname || '/dashboard';
                  navigate(redirectTo, { replace: true });
                } catch (err) {
                  setFormError(err.response?.data?.message || 'Invalid email or password');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  {formError && <div className="alert alert-danger">{formError}</div>}

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

                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-3 mb-0">
              Need an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
