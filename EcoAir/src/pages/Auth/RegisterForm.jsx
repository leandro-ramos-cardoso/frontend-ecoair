import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { api } from "../../services/api";

const RegisterForm = () => {
     const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL

  const [modalAberto, setModalAberto] = useState(false)

  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  })

  return (
    <div>RegisterForm</div>
  )
}

export default RegisterForm