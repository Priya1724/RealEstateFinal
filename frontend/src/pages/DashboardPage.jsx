import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import PropertyCard from '../components/PropertyCard.jsx';
import Spinner from '../components/Spinner.jsx';

const PAGE_SIZE = 9;

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchMyProperties = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/properties/me', { params: { page, size: PAGE_SIZE } });
      setProperties(data.content);
      setMeta({ page: data.page, totalPages: data.totalPages });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProperties();
  }, [fetchMyProperties]);

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    try {
      await api.delete('/properties/' + propertyId);
      setSuccessMessage('Property deleted successfully');
      fetchMyProperties(meta.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete property');
    }
  };

  const handlePageChange = (direction) => {
    const nextPage = meta.page + direction;
    if (nextPage >= 0 && nextPage < meta.totalPages) {
      fetchMyProperties(nextPage);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h3 mb-1">My property listings</h1>
          <p className="text-muted mb-0">Manage your listings and track approval status.</p>
        </div>
        <Link className="btn btn-primary" to="/properties/new">
          Add new listing
        </Link>
      </div>

      <div className="alert alert-warning">
        Listings require admin approval before they appear publicly. Status updates are shown below each card.
      </div>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading && <Spinner />}

      {!loading && properties.length === 0 && (
        <div className="alert alert-info">You have not created any properties yet.</div>
      )}

      <div className="row">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property}>
            <Link className="btn btn-outline-primary btn-sm" to={'/properties/' + property.id + '/edit'}>
              Edit
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(property.id)}>
              Delete
            </button>
          </PropertyCard>
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => handlePageChange(-1)}
            disabled={meta.page === 0 || loading}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {meta.page + 1} of {meta.totalPages}
          </span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handlePageChange(1)}
            disabled={meta.page + 1 >= meta.totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
