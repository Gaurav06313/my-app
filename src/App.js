import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Nav, Navbar } from 'react-bootstrap';


function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [tableData, setTableData] = useState(() => {
    // Try to get data from localStorage, if not found use default data
    const savedData = localStorage.getItem('table-Data');
    return savedData ? JSON.parse(savedData) : {
      primary: [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
      ],
      success: [
        { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
        { id: 2, firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com' }
      ],
      info: [
        { id: 1, firstName: 'Sarah', lastName: 'Parker', email: 'sarah@example.com' },
        { id: 2, firstName: 'Mike', lastName: 'Thomas', email: 'mike@example.com' }
      ]
    };
  });

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

  return (
    <Container>

      <div className="my-4">
        <h2 className="mb-3">Styled Tables</h2>

      <Button variant="primary" onClick={handleEdit} disabled={isEditing}>Edit</Button>
      
        
        {/* Primary colored table with hover */}
        <h4 className="mt-4">Primary Table</h4>
        <table className="table table-hover table-bordered">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {tableData.primary.map(row => (
              <tr key={row.id} className={row.id === 1 ? "table-primary-light" : ""}>
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
              </tr>
            ))}
          </tbody>
        </table>
           

        {/* Success colored table with hover */}
        <h4 className="mt-4">Success Table</h4>
        <table className="table table-hover table-bordered">
          <thead className="table-success">
             {/* End of Primary Table */}
              <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
              </thead>
              <tbody>
            {tableData.success.map(row => (
              <tr key={row.id} className={row.id === 1 ? "success-primary-light" : ""}>
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
              </tr>
            ))}
          </tbody>
        </table>
        

        {/* Info colored table with hover */}
        <h4 className="mt-4">Info Table</h4>
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-info">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
          {tableData.info.map(row => (
              <tr key={row.id} className={row.id === 1 ? "info-primary-light" : ""}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="secondary" onClick={handleSave} disabled={!isEditing}>Save</Button>
    </Container>
  );
}



export default App;
