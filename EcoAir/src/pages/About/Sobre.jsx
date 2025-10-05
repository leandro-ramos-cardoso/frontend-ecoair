import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaArrowRight, FaLanguage } from "react-icons/fa";

const Sobre = () => {
    // Estado para idioma: 'pt' = Português, 'en' = English
    const [lang, setLang] = useState('pt');

    // Função para alternar idioma
    const toggleLang = () => {
    setLang(lang === 'pt' ? 'en' : 'pt');
    }

    // Textos em PT e EN
    const texts = {
        pt: {
            visualizarMapa: "Visualizar Mapa",
            alternarIdioma: "English",
            desafioTitulo: "Tornando o Invisível, Visível",
            desafioSubtitulo: "Challenge: From EarthData to Action: Cloud Computing with Earth Observation Data for Predicting Cleaner, Safer Skies",
            time: "Time: Programa AI - Victor Lira, Natanael Junior, Leandro Cardoso, Gabriel Chaves, Gabriel Mamede",
            problemaTitulo: "A Ameaça Invisível",
            problemaTexto: "O ar que respiramos está cada vez mais saturado por poluentes invisíveis e mortais como CO, SO2, NO2, PM2.5, carbono negro e O3. A poluição do ar é responsável por cerca de 7 milhões de mortes prematuras anuais, afetando principalmente crianças e comunidades vulneráveis.",
            solucaoTitulo: "Nossa Solução",
            solucaoTexto: "Protótipo com sensor MQ-9 e microcontrolador ESP32 para medir CO em PPM. Dados enviados para banco e apresentados em mapa interativo (Bom, Médio, Ruim). Sistema escalável para outros gases e integrado à API OpenAQ, permitindo comparação global e validação.",
            repoTitulo: "Links para o repositorio GitHub",
      repoTexto: "https://github.com/leandro-ramos-cardoso/iot | https://github.com/leandro-ramos-cardoso/frontend-ecoair | https://github.com/leandro-ramos-cardoso/backend-ecoair",
            impactoTitulo: "Impacto e Benefícios",
            impactoLista: [
                "Monitoramento em tempo real da qualidade do ar",
                "Ferramenta acessível e de baixo custo",
                "Base para políticas públicas e ações preventivas",
                "Conscientização de empresas e cidadãos",
                "Base para expansão e integração de outros gases nocivos"
            ],
            conclusaoTitulo: "Uma Ponte entre Ciência, Saúde e Ação",
            conclusaoTexto: "Nossa solução cria um ecossistema de informação, transformando dados em decisões inteligentes, prevenindo doenças e promovendo ar limpo como direito de todos."
        },
    en: {
      visualizarMapa: "View Map",
      alternarIdioma: "Português",
      desafioTitulo: "Making the Invisible Visible",
      desafioSubtitulo: "Challenge: From EarthData to Action: Cloud Computing with Earth Observation Data for Predicting Cleaner, Safer Skies",
      time: "Team: Programa AI - Victor Lira, Natanael Junior, Leandro Cardoso, Gabriel Chaves, Gabriel Mamede",
      problemaTitulo: "The Invisible Threat",
      problemaTexto: "The air we breathe is increasingly saturated with invisible and deadly pollutants such as CO, SO2, NO2, PM2.5, black carbon, and O3. Air pollution causes approximately 7 million premature deaths annually, mainly affecting children and vulnerable communities.",
      solucaoTitulo: "Our Solution",
      solucaoTexto: "Prototype using MQ-9 sensor and ESP32 microcontroller to measure CO in PPM. Data sent to a database and displayed on an interactive map (Good, Medium, Poor). Scalable system for other gases and integrated with OpenAQ API for global comparison and validation.",
      repoTitulo: "Links to Repository GitHub",
      repoTexto: "https://github.com/leandro-ramos-cardoso/iot | https://github.com/leandro-ramos-cardoso/frontend-ecoair | https://github.com/leandro-ramos-cardoso/backend-ecoair",
      impactoTitulo: "Impact and Benefits",
      impactoLista: [
        "Real-time air quality monitoring",
        "Accessible and low-cost tool",
        "Basis for public policies and preventive actions",
        "Awareness for companies and citizens",
        "Scalable to include other harmful gases"
      ],
      conclusaoTitulo: "A Bridge Between Science, Health, and Action",
      conclusaoTexto: "Our solution creates an information ecosystem, transforming data into smart decisions, preventing diseases, and promoting clean air as a right for all."
    }
  };

  const t = texts[lang]; // Texto atual conforme idioma

   return (
   <Container className="my-5 position-relative">
      {/* Botões no topo */}
      <Row className="mb-5 justify-content-center">
        <Col xs="12" md="6" className="d-flex justify-content-center">
          <Button 
            href="/" 
            size="lg" 
            variant="success" 
            style={{ fontSize: '1.5rem', padding: '1rem 2rem', borderRadius: '10px' }}
          >
            {t.visualizarMapa} < FaArrowRight/>
          </Button>     
        </Col>
      </Row>

       {/* Botão de idioma discreto no canto superior direito */}
      <Button 
        onClick={toggleLang} 
        size="sm" 
        variant="outline-secondary" 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          padding: '0.3rem 0.7rem', 
          fontSize: '0.8rem', 
          opacity: 0.6 
        }}
      >
        {t.alternarIdioma}
      </Button>

    {/* Seções com Cards */}
      <Row className="mb-4">
        <Col>
          <Card bg="light" className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="text-primary">{t.desafioTitulo}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{t.desafioSubtitulo}</Card.Subtitle>
              <Card.Text>{t.time}</Card.Text>
            </Card.Body>
          </Card>

        <Card bg="secundary" className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="text-primary">{t.repoTitulo}</Card.Title>
              <Card.Text>{t.repoTexto}</Card.Text>
            </Card.Body>
          </Card>

          <Card border="danger" className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="text-danger">{t.problemaTitulo}</Card.Title>
              <Card.Text>{t.problemaTexto}</Card.Text>
            </Card.Body>
          </Card>

          <Card border="success" className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="text-success">{t.solucaoTitulo}</Card.Title>
              <Card.Text>{t.solucaoTexto}</Card.Text>
            </Card.Body>
          </Card>

          <Card border="info" className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="text-info">{t.impactoTitulo}</Card.Title>
              <ul>
                {t.impactoLista.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-warning">{t.conclusaoTitulo}</Card.Title>
              <Card.Text>{t.conclusaoTexto}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Sobre
