import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios.js';
import Spinner from '../components/Spinner.jsx';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().min(30, 'Provide more detail (minimum 30 characters)').required('Description is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  type: Yup.string().oneOf(['SALE', 'RENT']).required('Property type is required'),
  location: Yup.string().required('Location is required'),
  contactEmail: Yup.string().email('Enter a valid email').nullable(),
  contactPhone: Yup.string().nullable()
});

const defaultValues = {
  title: '',
  description: '',
  price: '',
  type: 'SALE',
  location: '',
  contactEmail: '',
  contactPhone: '',
  image: null
};

const PropertyFormPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      const fetchProperty = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data } = await api.get('/properties/' + id);
          setInitialValues({
            title: data.title,
            description: data.description,
            price: data.price,
            type: data.type,
            location: data.location,
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            image: null
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Unable to load property');
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [isEdit, id]);

  const pageTitle = useMemo(() => (isEdit ? 'Update property' : 'Create a new property listing'), [isEdit]);
  const submitLabel = isEdit ? 'Save changes' : 'Create listing';

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">{pageTitle}</h2>
            <p className="text-muted">Approved listings appear on the marketplace once an admin reviews them.</p>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                  const payload = {
                    title: values.title,
                    description: values.description,
                    price: Number(values.price),
                    type: values.type,
                    location: values.location,
                    contactEmail: values.contactEmail || null,
                    contactPhone: values.contactPhone || null
                  };

                  const formData = new FormData();
                  formData.append('property', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
                  if (values.image) {
                    formData.append('image', values.image);
                  }

                  if (isEdit && id) {
                    await api.put('/properties/' + id, formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                  } else {
                    await api.post('/properties', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                  }

                  navigate('/dashboard');
                } catch (err) {
                  setError(err.response?.data?.message || 'Unable to save property');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form noValidate>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label" htmlFor="title">
                        Title
                      </label>
                      <Field name="title" className="form-control" placeholder="Spacious 3 bedroom apartment" />
                      <ErrorMessage component="div" className="form-error" name="title" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="type">
                        Listing type
                      </label>
                      <Field as="select" name="type" className="form-select">
                        <option value="SALE">For Sale</option>
                        <option value="RENT">For Rent</option>
                      </Field>
                      <ErrorMessage component="div" className="form-error" name="type" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label" htmlFor="description">
                      Description
                    </label>
                    <Field as="textarea" name="description" className="form-control" rows="5" />
                    <ErrorMessage component="div" className="form-error" name="description" />
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="price">
                        Price
                      </label>
                      <Field name="price" type="number" className="form-control" />
                      <ErrorMessage component="div" className="form-error" name="price" />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label" htmlFor="location">
                        Location
                      </label>
                      <Field name="location" className="form-control" placeholder="City, State" />
                      <ErrorMessage component="div" className="form-error" name="location" />
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="contactEmail">
                        Contact email (optional)
                      </label>
                      <Field name="contactEmail" type="email" className="form-control" />
                      <ErrorMessage component="div" className="form-error" name="contactEmail" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="contactPhone">
                        Contact phone (optional)
                      </label>
                      <Field name="contactPhone" type="text" className="form-control" />
                      <ErrorMessage component="div" className="form-error" name="contactPhone" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label" htmlFor="image">
                      Property image
                    </label>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0] || null;
                        setFieldValue('image', file);
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : submitLabel}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormPage;
