import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../services/api";

const LoginForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErro(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Usuário ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container fluid className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow p-4">
            <Card.Body>
              <h2 className="text-center mb-4 fw-bold text-success">
                Login
              </h2>
              <p className="text-center text-muted mb-4">
                Preencha os dados abaixo para logar
              </p>             

              {erro && <Alert variant="danger">{erro}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm