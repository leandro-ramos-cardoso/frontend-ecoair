import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { api } from '../../services/api';

const DeviceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [modalAberto, setModalAberto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [erro, setErro] = useState(null);

    const [device, setDevice] = useState({
        deviceName: '',
        mac: '',
        latitude: '',
        longitude: '',
        gasType: 'CO2',
    });

    const handleChange = (field) => (e) => {
        setDevice((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setErro(null);

        try {
            const payload = { ...device };

            if (id) {
                await api.put(`/device/data/${id}`, payload);
            } else {
                await api.post('/device/data', payload);
            }

            setModalAberto(true);
        } catch (e) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                'Houve um problema ao salvar o dispositivo.';
            setErro(msg);
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        const ctrl = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setErro(null);
                const { data } = await api.get(`/device/${id}`, { signal: ctrl.signal });
                if (ctrl.signal.aborted) return;
                setDevice({
                    deviceName: data?.deviceName || '',
                    mac: data?.mac || '',
                    latitude: data?.latitude?.toString?.() || '',
                    longitude: data?.longitude?.toString?.() || '',
                    gasType: data?.gasType || '',
                });
            } catch (e) {
                const canceled =
                    e?.name === 'CanceledError' ||
                    e?.name === 'AbortError' ||
                    e?.code === 'ERR_CANCELED';
                if (!canceled) {
                    setErro('Houve um erro ao carregar o dispositivo para edição.');
                    console.error(e);
                }
            } finally {
                if (!ctrl.signal.aborted) setLoading(false);
            }
        })();

        return () => ctrl.abort();
    }, [id]);

    if (loading) return <Container>Carregando...</Container>;
    if (erro) return <Container className="mt-3 alert alert-danger">{erro}</Container>;

    return (
        <Container fluid className="d-flex align-items-center mt-4">
            <Row className="w-100">
                <Col xs={12}>
                    <Card className="p-5 mt-3 mb-5">
                        <Card.Body>
                            <Card.Title>
                                <h2 className="d-flex align-items-center">
                                    {id ? 'Atualizar Dispositivo' : 'Cadastrar Dispositivo'}
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                {id
                                                    ? 'Verifique os dados do dispositivo para atualizar'
                                                    : 'Preencha os dados do dispositivo para cadastrar'}
                                            </Tooltip>
                                        }
                                    >
                                        <span style={{ cursor: 'pointer' }}>
                                            <FaQuestionCircle className={`ms-2 ${id ? 'text-warning' : 'text-success'}`} />
                                        </span>
                                    </OverlayTrigger>
                                </h2>
                            </Card.Title>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome do Dispositivo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={device.deviceName}
                                        onChange={handleChange('deviceName')}
                                        placeholder="Ex.: Sensor 01"
                                        required
                                        disabled={saving}
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>MAC Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={device.mac}
                                                onChange={handleChange('mac')}
                                                placeholder="Ex.: AA:BB:CC:DD:EE:FF"
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Tipo de Gás</Form.Label>
                                            <Form.Select
                                                value={device.gasType}
                                                onChange={handleChange('gasType')}
                                                required
                                                disabled={saving}
                                            >
                                                <option value="" disabled>
                                                    -- Selecione --
                                                </option>
                                                <option value="CO2">CO₂</option>
                                                <option value="CO">CO</option>
                                                <option value="NO2">NO₂</option>
                                                <option value="PM2_5">PM2.5</option>
                                                <option value="PM10">PM10</option>
                                                <option value="O3">O₃</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Latitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                inputMode="decimal"
                                                step="any"
                                                value={device.latitude}
                                                onChange={handleChange('latitude')}
                                                placeholder="-7.1186"
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Longitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                inputMode="decimal"
                                                step="any"
                                                value={device.longitude}
                                                onChange={handleChange('longitude')}
                                                placeholder="-34.8813"
                                                required
                                                disabled={saving}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    type="submit"
                                    size="lg"
                                    variant="success"
                                    className="w-100 mt-4 pt-3 pb-3"
                                    disabled={saving}
                                >
                                    {saving ? 'Salvando…' : id ? 'Atualizar Dispositivo' : 'Cadastrar Dispositivo'}
                                </Button>
                            </Form>

                            <Modal
                                show={modalAberto}
                                onHide={() => {
                                    setModalAberto(false);
                                    navigate('/devices'); // ajuste a rota conforme sua lista
                                }}
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title className="d-flex align-items-center">
                                        <FaCheckCircle className="text-success me-2" />
                                        {id ? 'Atualizado com Sucesso!' : 'Cadastrado com Sucesso!'}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {id
                                        ? 'O dispositivo foi atualizado com sucesso. Confira na lista!'
                                        : 'O dispositivo foi cadastrado com sucesso. Confira na lista!'}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" as={Link} to="/devices">
                                        Fechar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DeviceForm;
