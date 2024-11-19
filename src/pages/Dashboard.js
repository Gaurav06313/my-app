import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Nav, Navbar, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function SelectBasicExample() {
  return (
    <Form.Select aria-label="Default select example">
      <option>Open this select menu</option>
      <option value="1">primary</option>
      <option value="2">success</option>
      <option value="3">info</option>
    </Form.Select>
  );
}
function Dashboard() {
  const [editingRows, setEditingRows] = useState({});
  const [tableData, setTableData] = useState(() => {
    // Try to get data from localStorage, if not found use default data
    const savedData = localStorage.getItem('table-Data');
    return savedData ? JSON.parse(savedData) : {
      primary: [
      ],
      success: [
      ],
      info: [
      ]
    };
  });
  const [newEntry, setNewEntry] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [targetTable, setTargetTable] = useState('primary');
  const [showTableView, setShowTableView] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showProfileCards, setShowProfileCards] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    pinCode: ''
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (tableKey, rowId) => {
    setEditingRows(prev => ({
      ...prev,
      [`${tableKey}-${rowId}`]: true
    }));
  };

  const handleSaveRow = (tableKey, rowId) => {
    setEditingRows(prev => {
      const newState = { ...prev };
      delete newState[`${tableKey}-${rowId}`];
      return newState;
    });
    // Save to localStorage
    localStorage.setItem('table-Data', JSON.stringify(tableData));
  };

  const handleChange = (tableKey, id, field, value) => {
    setTableData(prev => ({
      ...prev,
      [tableKey]: prev[tableKey].map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    }));
  };

  const handleDelete = (tableKey, id) => {
    setTableData(prev => {
      const newData = {
        ...prev,
        [tableKey]: prev[tableKey].filter(row => row.id !== id)
      };
      // Save to localStorage inside the callback to ensure we have the latest data
      localStorage.setItem('table-Data', JSON.stringify(newData));
      return newData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate unique ID using timestamp and random number
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    // Store the data temporarily
    setTempData({
      ...newEntry,
      id: uniqueId,
      targetTable
    });

    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmation(false);
    setShowAddressForm(true);
  };

  const handleSaveProfile = () => {
    const completeProfile = {
      ...tempData,
      address: address
    };

    setTableData(prev => {
      const newData = {
        ...prev,
        [completeProfile.targetTable]: [...prev[completeProfile.targetTable], completeProfile]
      };
      localStorage.setItem('table-Data', JSON.stringify(newData));
      return newData;
    });

    // Reset all forms
    setNewEntry({ firstName: '', lastName: '', email: '' });
    setAddress({ street: '', city: '', pinCode: '' });
    setShowAddressForm(false);
    setTempData(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setTempData(null);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowProfile = (tableKey, rowId) => {
    const profile = tableData[tableKey].find(row => row.id === rowId);
    setSelectedProfile(profile);
    navigate(`/profile/${profile.id}`);
  };

  const renderTable = (tableKey, rows) => {
    if (rows.length === 0) return null;

    return (
      <div>
        <h3 className="mt-4 mb-3">{tableKey.charAt(0).toUpperCase() + tableKey.slice(1)} Table</h3>
        <table className="table table-hover table-bordered mb-5">
          <thead className={`table-${tableKey}`}>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isEditing = editingRows[`${tableKey}-${row.id}`];
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.firstName}
                        onChange={(e) => handleChange(tableKey, row.id, 'firstName', e.target.value)}
                        className="form-control"
                      />
                    ) : row.firstName}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.lastName}
                        onChange={(e) => handleChange(tableKey, row.id, 'lastName', e.target.value)}
                        className="form-control"
                      />
                    ) : row.lastName}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="email"
                        value={row.email}
                        onChange={(e) => handleChange(tableKey, row.id, 'email', e.target.value)}
                        className="form-control"
                      />
                    ) : row.email}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {isEditing ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleSaveRow(tableKey, row.id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(tableKey, row.id)}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowProfile(tableKey, row.id)}
                      >
                        Profile
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(tableKey, row.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProfileCards = () => {
    return (
      <div className="row g-4">
        {Object.values(tableData).flat().map((profile, index) => (
          <div key={index} className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{profile.firstName} {profile.lastName}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {profile.email}<br />
                  <strong>Address:</strong><br />
                  {profile.address?.street}<br />
                  {profile.address?.city}<br />
                  {profile.address?.pinCode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container>
      <div className="my-4">
        {!showTableView && !showAddressForm ? (
          // Initial Form View
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Add New Entry</h2>
              <Button 
                variant="primary" 
                onClick={() => setShowTableView(true)}
              >
                Show Tables
              </Button>
            </div>
            <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
              <div className="d-flex gap-3 mb-3">
                <Form.Group className="flex-grow-1">
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={newEntry.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="flex-grow-1">
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={newEntry.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="flex-grow-1">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newEntry.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="d-flex gap-2">
                <Form.Select
                  value={targetTable}
                  onChange={(e) => setTargetTable(e.target.value)}
                  style={{ width: '200px' }}
                >
                  <option value="primary">Primary Table</option>
                  <option value="success">Success Table</option>
                  <option value="info">Info Table</option>
                </Form.Select>
                <Button type="submit" variant="success">
                  Add Entry
                </Button>
              </div>
            </Form>

            {/* Confirmation Modal */}
            {showConfirmation && (
              <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Entry</h5>
                      <button type="button" className="btn-close" onClick={handleCancel}></button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to save the following information?</p>
                      <div className="mb-2">
                        <strong>First Name:</strong> {tempData?.firstName}
                      </div>
                      <div className="mb-2">
                        <strong>Last Name:</strong> {tempData?.lastName}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {tempData?.email}
                      </div>
                      <div>
                        <strong>Table:</strong> {tempData?.targetTable}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleConfirmSave}>
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : showAddressForm ? (
          // Address Form
          <>
            <h2 className="mb-4">Add Address Details</h2>
            <Form className="mb-4 p-3 border rounded">
              <div className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="pinCode"
                    value={address.pinCode}
                    onChange={handleAddressChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => setShowAddressForm(false)}>
                  Back
                </Button>
                <Button variant="success" onClick={handleSaveProfile}>
                  Save Profile
                </Button>
              </div>
            </Form>
          </>
        ) : (
          // Table View
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Table View</h2>
              <Button 
                variant="primary" 
                onClick={() => setShowTableView(false)}
              >
                Back to Form
              </Button>
            </div>

            {/* Render tables */}
            {Object.entries(tableData).map(([tableKey, rows]) => 
              rows.length > 0 && renderTable(tableKey, rows)
            )}

            {/* Show a message if no data exists */}
            {Object.values(tableData).every(rows => rows.length === 0) && (
              <div className="text-center p-4">
                <h4>No data available</h4>
                <p>Add some entries to see them here.</p>
              </div>
            )}
          </>
        )}

        {/* Profile Modal */}
        {showProfileModal && selectedProfile && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Profile Details</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setShowProfileModal(false);
                      setSelectedProfile(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {selectedProfile.firstName} {selectedProfile.lastName}
                      </h5>
                      <div className="card-text">
                        <p><strong>Email:</strong> {selectedProfile.email}</p>
                        {selectedProfile.address && (
                          <>
                            <p className="mb-1"><strong>Address:</strong></p>
                            <p className="mb-1">{selectedProfile.address.street}</p>
                            <p className="mb-1">{selectedProfile.address.city}</p>
                            <p className="mb-0">{selectedProfile.address.pinCode}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setShowProfileModal(false);
                      setSelectedProfile(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}



export default Dashboard;
