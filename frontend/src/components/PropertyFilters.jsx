import { useState } from 'react';

const initialFilters = {
  location: '',
  type: '',
  minPrice: '',
  maxPrice: '',
  keywords: ''
};

const PropertyFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onSearch(initialFilters);
  };

  return (
    <form className="card card-body mb-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={filters.location}
            onChange={handleChange}
            placeholder="City or neighborhood"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={filters.type}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="SALE">Sale</option>
            <option value="RENT">Rent</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Min Price</label>
          <input
            type="number"
            name="minPrice"
            className="form-control"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            className="form-control"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Keywords</label>
          <input
            type="text"
            name="keywords"
            className="form-control"
            value={filters.keywords}
            onChange={handleChange}
            placeholder="Title or description"
          />
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">
          Search
        </button>
        <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default PropertyFilters;
