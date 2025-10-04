import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios.js';
import PropertyCard from '../components/PropertyCard.jsx';
import Spinner from '../components/Spinner.jsx';

const PAGE_SIZE = 9;
const USER_PAGE_SIZE = 10;

const AdminDashboardPage = () => {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [propertyMeta, setPropertyMeta] = useState({ page: 0, totalPages: 0 });
  const [users, setUsers] = useState([]);
  const [userMeta, setUserMeta] = useState({ page: 0, totalPages: 0 });
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchPendingProperties = useCallback(async (page = 0) => {
    setLoadingProperties(true);
    setError(null);
    try {
      const { data } = await api.get('/admin/properties/pending', { params: { page, size: PAGE_SIZE } });
      setPendingProperties(data.content);
      setPropertyMeta({ page: data.page, totalPages: data.totalPages });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load pending properties');
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchUsers = useCallback(async (page = 0) => {
    setLoadingUsers(true);
    setError(null);
    try {
      const { data } = await api.get('/admin/users', { params: { page, size: USER_PAGE_SIZE } });
      setUsers(data.content);
      setUserMeta({ page: data.page, totalPages: data.totalPages });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingProperties();
    fetchUsers();
  }, [fetchPendingProperties, fetchUsers]);

  const handleApprove = async (propertyId, approve) => {
    setMessage(null);
    setError(null);
    try {
      await api.post('/admin/properties/' + propertyId + (approve ? '/approve' : '/reject'));
      setMessage('Property ' + (approve ? 'approved' : 'rejected') + ' successfully');
      fetchPendingProperties(propertyMeta.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update property status');
    }
  };

  const handleRoleChange = async (userId, role) => {
    setMessage(null);
    setError(null);
    try {
      await api.put('/admin/users/' + userId + '/role', { role });
      setMessage('User role updated');
      fetchUsers(userMeta.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? Their properties will be removed.')) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      await api.delete('/admin/users/' + userId);
      setMessage('User deleted');
      fetchUsers(userMeta.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Admin console</h1>
          <p className="text-muted mb-0">Approve listings and manage platform users.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Pending property approvals</h2>
          {loadingProperties && <Spinner />}
          {!loadingProperties && pendingProperties.length === 0 && (
            <div className="alert alert-info">No properties awaiting approval.</div>
          )}
          <div className="row">
            {pendingProperties.map((property) => (
              <PropertyCard key={property.id} property={property}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleApprove(property.id, true)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleApprove(property.id, false)}
                >
                  Reject
                </button>
              </PropertyCard>
            ))}
          </div>
          {propertyMeta.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchPendingProperties(Math.max(propertyMeta.page - 1, 0))}
                disabled={propertyMeta.page === 0 || loadingProperties}
              >
                Previous
              </button>
              <span className="text-muted">
                Page {propertyMeta.page + 1} of {propertyMeta.totalPages}
              </span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchPendingProperties(propertyMeta.page + 1)}
                disabled={propertyMeta.page + 1 >= propertyMeta.totalPages || loadingProperties}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5">User management</h2>
          {loadingUsers && <Spinner />}
          {!loadingUsers && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={user.role}
                          onChange={(event) => handleRoleChange(user.id, event.target.value)}
                        >
                          <option value="ROLE_CUSTOMER">Customer</option>
                          <option value="ROLE_ADMIN">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {userMeta.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchUsers(Math.max(userMeta.page - 1, 0))}
                disabled={userMeta.page === 0 || loadingUsers}
              >
                Previous
              </button>
              <span className="text-muted">
                Page {userMeta.page + 1} of {userMeta.totalPages}
              </span>
              <button
                className="btn btn-outline-secondary"
                onClick={() => fetchUsers(userMeta.page + 1)}
                disabled={userMeta.page + 1 >= userMeta.totalPages || loadingUsers}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
