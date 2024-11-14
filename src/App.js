import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Nav, Navbar } from 'react-bootstrap';

function App() {
  return (
    <Container>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">React App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <header className="text-center py-5">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="mt-3">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button 
          variant="primary" 
          href="https://reactjs.org" 
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </Button>
      </header>
    </Container>
  );
}

export default App;
