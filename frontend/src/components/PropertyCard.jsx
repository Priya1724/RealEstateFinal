const PropertyCard = ({ property, children }) => {
  const formattedPrice = property.price ? property.price.toLocaleString() : 'N/A';

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img
          src={property.imageUrl || 'https://placehold.co/600x400?text=RealNest'}
          className="card-img-top"
          alt={property.title}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{property.title}</h5>
          <p className="card-text text-muted mb-1">{property.location}</p>
          <p className="card-text fw-semibold">{'$' + formattedPrice}</p>
          <p className="badge bg-secondary align-self-start">{property.type}</p>
          <p className="small text-muted mt-auto">Status: {property.status}</p>
          {children && <div className="mt-3 d-flex gap-2 flex-wrap">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
