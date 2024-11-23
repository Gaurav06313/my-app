import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { AppContext } from '../AppContext';


function Profile() {
  const { state: { dashboard: { allUsers = {} } = {} } = {}, dispatch } = useContext(AppContext)
  const { id } = useParams(); 
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfileData = () => {
      // Get the table data from localStorage
      const tableData = JSON.parse(localStorage.getItem('table-Data'));
      
      // Search through all tables (primary, success, info) to find the profile
      let foundProfile = null;
      if (allUsers) {
        for (const tableKey of ['primary', 'success', 'info']) {
          const profile = (allUsers[tableKey] || []).find(row => row.id === parseInt(id));
          if (profile) {
            foundProfile = profile;
            break;
          }
        }
      }
      setProfileData(foundProfile);
    };

    fetchProfileData();
  }, [id]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');  // This will navigate to the root path
  };

  if (!profileData) {
    return (
      <Container className="mt-4">
        <div className="text-center">Profile not found</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4">Profile Details</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <h5>Personal Information</h5>
            <p><strong>First Name:</strong> {profileData.firstName}</p>
            <p><strong>Last Name:</strong> {profileData.lastName}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
          </div>
          
          {profileData.address && (
            <div>
              <h5>Address</h5>
              <p><strong>Street:</strong> {profileData.address.street}</p>
              <p><strong>City:</strong> {profileData.address.city}</p>
              <p><strong>PIN Code:</strong> {profileData.address.pinCode}</p>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button 
              variant="secondary" 
              onClick={handleGoToDashboard}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
