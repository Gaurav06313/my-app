import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Nav, Navbar, Form } from 'react-bootstrap';


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
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
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

    // Generate new ID
    const currentIds = tableData[targetTable].map(row => row.id);
    const newId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;

    // Add new entry to specified table
    setTableData(prev => ({
      ...prev,
      [targetTable]: [...prev[targetTable], { ...newEntry, id: newId }]
    }));

    // Save to localStorage
    localStorage.setItem('table-Data', JSON.stringify(tableData));

    // Clear form
    setNewEntry({
      firstName: '',
      lastName: '',
      email: ''
    });
  };

  return (
    <Container>
      <div className="my-4">
        <h2 className="mb-3">Styled Tables</h2>

        {/* Updated Form */}
        <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
          <h4 className="mb-3">Add New Entry</h4>
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

        {/* Global Edit/Save buttons */}
        <div className="d-flex gap-2 mb-3">
          <Button variant="primary" onClick={handleEdit} disabled={isEditing}>Edit All</Button>
          <Button variant="secondary" onClick={handleSave} disabled={!isEditing}>Save All</Button>
        </div>

        {tableData.primary.length ?
          (<div>
            <h3 className="mt-4 mb-3">Primary Table</h3>
            <table className="table table-hover table-bordered mb-5">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.primary.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.firstName}
                          onChange={(e) => handleChange('primary', row.id, 'firstName', e.target.value)}
                          className="form-control"
                        />
                      ) : row.firstName}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={row.lastName}
                          onChange={(e) => handleChange('primary', row.id, 'lastName', e.target.value)}
                          className="form-control"
                        />
                      ) : row.lastName}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="email"
                          value={row.email}
                          onChange={(e) => handleChange('primary', row.id, 'email', e.target.value)}
                          className="form-control"
                        />
                      ) : row.email}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete('primary', row.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>) : null}


        {/* Success Table */}
        <h3 className="mt-4 mb-3">Success Table</h3>
        <table className="table table-hover table-bordered mb-5">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.success.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.firstName}
                      onChange={(e) => handleChange('success', row.id, 'firstName', e.target.value)}
                      className="form-control"
                    />
                  ) : row.firstName}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.lastName}
                      onChange={(e) => handleChange('success', row.id, 'lastName', e.target.value)}
                      className="form-control"
                    />
                  ) : row.lastName}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      value={row.email}
                      onChange={(e) => handleChange('success', row.id, 'email', e.target.value)}
                      className="form-control"
                    />
                  ) : row.email}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete('success', row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Info Table */}
        <h3 className="mt-4 mb-3">Info Table</h3>
        <table className="table table-hover table-bordered mb-5">
          <thead className="table-info">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.info.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.firstName}
                      onChange={(e) => handleChange('info', row.id, 'firstName', e.target.value)}
                      className="form-control"
                    />
                  ) : row.firstName}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={row.lastName}
                      onChange={(e) => handleChange('info', row.id, 'lastName', e.target.value)}
                      className="form-control"
                    />
                  ) : row.lastName}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      value={row.email}
                      onChange={(e) => handleChange('info', row.id, 'email', e.target.value)}
                      className="form-control"
                    />
                  ) : row.email}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete('info', row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}



export default Dashboard;
