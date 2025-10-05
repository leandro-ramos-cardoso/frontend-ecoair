import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../services/api";

const RegisterForm = () => {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.password !== confirmPassword) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post("/auth/register", usuario);
      console.log("Usuário cadastrado com sucesso:", response.data);
      setSucesso(true);
      setErro("");
      setTimeout(() => navigate("/login"), 2000); // redireciona após 2s
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErro("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
      >
         <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold text-success">
                Criar Conta
              </h2>
              <p className="text-center text-muted mb-4">
                Preencha os dados abaixo para registrar um usuário
              </p>

              {erro && <Alert variant="danger">{erro}</Alert>}
              {sucesso && (
                <Alert variant="success">
                  Usuário cadastrado com sucesso! Redirecionando...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Usuário</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu username"
                    value={usuario.username}
                    onChange={(e) =>
                      setUsuario({ ...usuario, username: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={usuario.email}
                    onChange={(e) =>
                      setUsuario({ ...usuario, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    value={usuario.password}
                    onChange={(e) =>
                      setUsuario({ ...usuario, password: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Tipo de Usuário</Form.Label>
                  <Form.Select
                    value={usuario.role}
                    onChange={(e) =>
                      setUsuario({ ...usuario, role: e.target.value })
                    }
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="USER">Usuário</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  type="submit"
                  variant="success"
                  className="w-100 py-2 fw-bold"
                >
                  Registrar
                </Button>
              </Form>

              <div className="text-center mt-4">
                <small>
                  Já possui conta?{" "}
                  <Link to="/login" className="text-success fw-bold">
                    Entrar
                  </Link>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        </Container>
  )
}

export default RegisterForm