import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import logo from "../assets/logo-ecoair.png";

const Menu = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' sticky='top' className='shadow'>
      <Container>
        <Navbar.Brand as={Link} to='/' className="fw-bold d-flex align-items-center">
        <img
            src={logo}
            alt="Eco Air"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          Eco Air
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='menu-principal' />

        <Navbar.Collapse id='menu-principal'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/device-list">Ver Device</Nav.Link>
            <Nav.Link as={Link} to="/register-device">Registrar Device</Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span>
                  <FaUserCircle className='me-2' />
                  Gabriel Chaves
                </span>
              }
              align="end"
            >
              <NavDropdown.Item>Meu Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <FaSignOutAlt className='me-2' /> Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Menu