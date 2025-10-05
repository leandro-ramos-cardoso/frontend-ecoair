import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo-ecoair.png";
import { api } from "../services/api";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      return;
    }

    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/auth/me", { signal: ctrl.signal });
        setUsuario(data ?? null);
      } catch (e) {
        if (e.code === 'ERR_CANCELED') {
          return;
        }

        if (e?.response?.status === 401 || e?.response?.status === 403) {
          localStorage.removeItem("token");
          setUsuario(null);
        } else {
          console.error("Erro ao obter /me:", e);
          setUsuario(null);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/login");
  };

  const tituloDropdown = (
    <span className="d-inline-flex align-items-center">
      <FaUserCircle className="me-2" />
      {loading ? "Carregando..." : (usuario?.name ?? usuario?.nome ?? usuario?.username ?? "Usuário")}
    </span>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <img
            src={logo}
            alt="Eco Air"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          Eco Air
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/device-list">Ver Device</Nav.Link>
            <Nav.Link as={Link} to="/register-device">Registrar Device</Nav.Link>
            <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
          </Nav>

          <Nav>
            {!usuario && !loading ? (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            ) : (
              <NavDropdown title={tituloDropdown} align="end">
                <NavDropdown.Item as={Link} to="/meu-perfil">
                  Meu Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Sair
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;