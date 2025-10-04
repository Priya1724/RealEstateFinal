import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import PropertyFilters from '../components/PropertyFilters.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import Spinner from '../components/Spinner.jsx';

const PAGE_SIZE = 9;

const sanitizeFilters = (filters) => {
  const cleaned = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const fetchProperties = useCallback(async (page = 0, filters = activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filters && Object.keys(filters).length > 0) {
        response = await api.get('/properties/search', {
          params: { ...filters, page, size: PAGE_SIZE }
        });
      } else {
        response = await api.get('/properties', { params: { page, size: PAGE_SIZE } });
      }
      setProperties(response.data.content);
      setMeta({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchProperties(0, activeFilters);
  }, [fetchProperties, activeFilters]);

  const handleSearch = (filters) => {
    const cleaned = sanitizeFilters(filters);
    setActiveFilters(cleaned);
  };

  const handlePageChange = (direction) => {
    const nextPage = meta.page + direction;
    if (nextPage >= 0 && nextPage < meta.totalPages) {
      fetchProperties(nextPage, activeFilters);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">Find your next home</h1>
          <p className="text-muted mb-0">Browse verified listings across RealNest</p>
        </div>
        <Link className="btn btn-primary" to="/properties/new">
          List a Property
        </Link>
      </div>

      <PropertyFilters onSearch={handleSearch} />

      {loading && <Spinner />}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && properties.length === 0 && (
        <div className="alert alert-info">No properties found. Try adjusting your filters.</div>
      )}

      <div className="row">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property}>
            <Link className="btn btn-outline-primary btn-sm" to={'/properties/' + property.id}>
              View Details
            </Link>
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

export default HomePage;
