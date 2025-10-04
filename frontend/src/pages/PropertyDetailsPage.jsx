import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Spinner from '../components/Spinner.jsx';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/properties/' + id);
        setProperty(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!property) {
    return null;
  }

  const formattedPrice = property.price ? property.price.toLocaleString() : 'N/A';

  return (
    <div className="row">
      <div className="col-lg-7">
        <div className="card shadow-sm mb-4">
          <img
            src={property.imageUrl || 'https://placehold.co/1200x600?text=RealNest'}
            className="card-img-top"
            alt={property.title}
          />
          <div className="card-body">
            <h1 className="h3">{property.title}</h1>
            <p className="text-muted">{property.location}</p>
            <p className="h4 text-primary">{'$' + formattedPrice}</p>
            <span className="badge bg-secondary">{property.type}</span>
            <span className="badge bg-light text-dark ms-2">Status: {property.status}</span>
            <hr />
            <h5>About this property</h5>
            <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="h5">Contact details</h4>
            <p className="mb-1">
              <strong>Listed by:</strong> {property.owner?.name}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {property.contactEmail || property.owner?.email}
            </p>
            {property.contactPhone && (
              <p className="mb-1">
                <strong>Phone:</strong> {property.contactPhone}
              </p>
            )}
            <p className="text-muted small mb-0 mt-3">
              Listings remain hidden from the public until approved by an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
