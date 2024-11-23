import { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Nav, Navbar, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';


function Dashboard() {
  const { state: { dashboard: { allUsers = {} } = {} } = {}, dispatch } = useContext(AppContext)
  const [editingRows, setEditingRows] = useState(0);
  const [tableData, setTableData] = useState({
    primary: [],
    success: [],
    info: []
  });
  const [newEntry, setNewEntry] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [targetTable, setTargetTable] = useState('primary');
  const [showTableView, setShowTableView] = useState(() => {
    const savedData = localStorage.getItem('table-Data');
    if (!savedData) return false;

    const data = JSON.parse(savedData);
    // Check if any table has data
    return Object.values(data).some(table => table.length > 0);
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempData, setTempData] = useState({});
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
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    date: '',
    type: ''
  });
  const [selectedUserTables, setSelectedUserTables] = useState([]);
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses-data');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

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

    // Save the basic profile without address
    setTableData(prev => {
      const newData = {
        ...prev,
        [tempData.targetTable]: [...prev[tempData.targetTable], {
          ...tempData,
          address: null
        }]
      };
      /*localStorage.setItem('table-Data', JSON.stringify(newData));*/
      return newData;
    });
    dispatch({
      type: 'ADD_NEW_USER',
      payload: {
        ...tableData,
        [tempData.targetTable]: [...tableData[tempData.targetTable], {
          ...tempData,
          address: null
        }]
      }
    })


    // Reset forms
    setNewEntry({ firstName: '', lastName: '', email: '' });
    setTempData(null);
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
    const profile = allUsers[tableKey].find(row => row.id === rowId);
    setSelectedProfile(profile);
    navigate(`/profile/${profile.id}`);
  };

  const handleEditAddress = (tableKey, rowId) => {
    const profile = allUsers[tableKey].find(row => row.id === rowId);
    setEditingAddress({ tableKey, rowId });
    setAddress(profile.address || { street: '', city: '', pinCode: '' });
    setShowAddressEdit(true);
  };

  const handleSaveAddress = () => {
    setTableData(prev => {
      const newData = {
        ...prev,
        [editingAddress.tableKey]: prev[editingAddress.tableKey].map(row =>
          row.id === editingAddress.rowId ? { ...row, address } : row
        )
      };
      localStorage.setItem('table-Data', JSON.stringify(newData));
      return newData;
    });

    setShowAddressEdit(false);
    setEditingAddress(null);
    setAddress({ street: '', city: '', pinCode: '' });
  };

  const handleExpenseClick = () => {
    setShowExpenseModal(true);
    setSelectedUserIds([]);
    setSelectedUserTables([]);
  };

  const handleUserCheckboxChange = (tableKey, userId) => {
    const userIdentifier = `${tableKey}|${userId}`;
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    setSelectedUserTables(prev => {
      if (prev.includes(tableKey)) {
        return prev.filter(table => table !== tableKey);
      } else {
        return [...prev, tableKey];
      }
    });
  };

  const handleExpenseSave = () => {
    const expenseId = Date.now() + Math.floor(Math.random() * 1000);

    // Create new expense object
    const newExpense = {
      id: expenseId,
      amount: expenseData.amount,
      description: expenseData.description,
      date: expenseData.date,
      type: expenseData.type,
      users: selectedUserIds.map((userId, index) => ({
        userId,
        tableKey: selectedUserTables[index],
        userName: (() => {
          const user = allUsers[selectedUserTables[index]].find(u => u.id === userId);
          return `${user.firstName} ${user.lastName}`;
        })()
      }))
    };

    // Update expenses state and local storage
    setExpenses(prevExpenses => {
      const updatedExpenses = [...prevExpenses, newExpense];
      localStorage.setItem('expenses-data', JSON.stringify(updatedExpenses));
      return updatedExpenses;
    });

    // Update user data in tableData
    setTableData(prev => {
      const newData = { ...prev };

      selectedUserIds.forEach((userId, index) => {
        const tableKey = selectedUserTables[index];
        newData[tableKey] = newData[tableKey].map(user => {
          if (user.id === userId) {
            return {
              ...user,
              expenses: [...(user.expenses || []), {
                id: expenseId,
                amount: expenseData.amount,
                description: expenseData.description,
                date: expenseData.date,
                type: expenseData.type
              }]
            };
          }
          return user;
        });
      });

      localStorage.setItem('table-Data', JSON.stringify(newData));
      return newData;
    });

    resetExpenseState();
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteExpense = (tableKey, userId, expenseId) => {
    // Remove from expenses storage
    setExpenses(prevExpenses => {
      const updatedExpenses = prevExpenses.filter(exp => exp.id !== expenseId);
      localStorage.setItem('expenses-data', JSON.stringify(updatedExpenses));
      return updatedExpenses;
    });

    // Remove from user data
    setTableData(prev => {
      const newData = {
        ...prev,
        [tableKey]: prev[tableKey].map(user => {
          if (user.id === userId) {
            return {
              ...user,
              expenses: (user.expenses || []).filter(exp => exp.id !== expenseId)
            };
          }
          return user;
        })
      };
      localStorage.setItem('table-Data', JSON.stringify(newData));
      return newData;
    });
  };

  const renderTable = (tableKey, rows) => {
    return (
      <div key={tableKey}>
        <h3 className="mt-4 mb-3">{tableKey.charAt(0).toUpperCase() + tableKey.slice(1)} Table</h3>
        <table className="table table-hover table-bordered mb-5">
          <thead className={`table-${tableKey}`}>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isEditing = editingRows[`${tableKey}-${row.id}`];
              return (
                <tr key={row.id}>
                  <td>{index + 1}</td>
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
                    {row.address ? (
                      <>
                        {row.address.street}<br />
                        {row.address.city}<br />
                        {row.address.pinCode}
                      </>
                    ) : (
                      <span className="text-muted">No address</span>
                    )}
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
                        <>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(tableKey, row.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditAddress(tableKey, row.id)}
                          >
                            {row.address ? 'Edit Address' : 'Add Address'}
                          </Button>
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
                        </>
                      )}
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

  // Add this function to handle the Go to Form button click
  const handleGoToForm = () => {
    setShowTableView(false);
  };

  // Add this function with your other function declarations
  const resetExpenseState = () => {
    setShowExpenseModal(false);
    setSelectedUserIds([]);
    setSelectedUserTables([]);
    setExpenseData({
      amount: '',
      description: '',
      date: '',
      type: ''
    });
  };

  return (
    <Container>
      <div className="my-4">
        {showAddressEdit ? (
          // Address Edit Form
          <>
            <h2 className="mb-4">Edit Address Details</h2>
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
                <Button variant="secondary" onClick={() => {
                  setShowAddressEdit(false);
                  setEditingAddress(null);
                }}>
                  Cancel
                </Button>
                <Button variant="success" onClick={handleSaveAddress}>
                  Save Address
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <>
            {showTableView ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Table View</h2>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      onClick={handleExpenseClick}
                    >
                      Add Expense
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleGoToForm}
                    >
                      Go to Form
                    </Button>
                  </div>
                </div>

                {/* Only render tables that have data */}
                {Object.entries(tableData).map(([tableKey, rows]) =>
                  rows.length > 0 ? renderTable(tableKey, rows) : null
                )}

                {/* Show message if no tables have data */}
                {Object.values(allUsers).every(rows => rows.length === 0) && (
                  <div className="alert alert-info text-center">
                    <p className="mb-0">No data available in any table. Please add some entries.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Add New Entry</h2>
                  {Object.values(allUsers).some(table => table.length > 0) && (
                    <Button
                      variant="primary"
                      onClick={() => setShowTableView(true)}
                    >
                      View Tables
                    </Button>
                  )}
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
                          <Button variant="success" onClick={handleConfirmSave}>
                            Skip Address
                          </Button>
                          <Button variant="primary" onClick={() => {
                            setShowConfirmation(false);
                            setShowAddressForm(true);
                          }}>
                            Add Address
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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

        {/* Expense Modal */}
        {showExpenseModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Expense</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowExpenseModal(false);
                      setSelectedUserIds([]);
                      setSelectedUserTables([]);
                      setExpenseData({ amount: '', description: '', date: '', type: '' });
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  {!selectedUserIds.length ? (
                    <Form.Group className="mb-3">
                      <Form.Label>Select Users</Form.Label>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {Object.entries(allUsers).map(([tableKey, users]) => (
                          <div key={tableKey}>
                            <h6 className="mt-2">{tableKey.charAt(0).toUpperCase() + tableKey.slice(1)} Table</h6>
                            {users.map(user => (
                              <Form.Check
                                key={`${tableKey}-${user.id}`}
                                type="checkbox"
                                id={`user-${tableKey}-${user.id}`}
                                label={`${user.firstName} ${user.lastName}`}
                                onChange={() => handleUserCheckboxChange(tableKey, user.id)}
                                checked={selectedUserIds.includes(user.id)}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  ) : !expenseData.type ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Expense Type</Form.Label>
                        <Form.Select
                          name="type"
                          value={expenseData.type}
                          onChange={handleExpenseChange}
                          required
                        >
                          <option value="">Choose type...</option>
                          <option value="food">Food</option>
                          <option value="transport">Transport</option>
                          <option value="utilities">Utilities</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedUserIds([]);
                            setSelectedUserTables([]);
                          }}
                          className="mb-3"
                        >
                          Back to user selection
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          value={expenseData.amount}
                          onChange={handleExpenseChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          name="description"
                          value={expenseData.description}
                          onChange={handleExpenseChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={expenseData.date}
                          onChange={handleExpenseChange}
                          required
                        />
                      </Form.Group>
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setExpenseData(prev => ({ ...prev, type: '' }));
                          }}
                          className="mb-3"
                        >
                          Back to expense type
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowExpenseModal(false);
                      setSelectedUserIds([]);
                      setSelectedUserTables([]);
                      setExpenseData({ amount: '', description: '', date: '', type: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  {selectedUserIds.length > 0 && (
                    <Button
                      variant="primary"
                      onClick={handleExpenseSave}
                    >
                      Save Expense for {selectedUserIds.length} Users
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Address Form */}
        {showAddressForm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Address</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowAddressForm(false);
                      setTempData(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <Form>
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
                  </Form>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAddressForm(false);
                      setTempData(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                  >
                    Save Profile with Address
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
