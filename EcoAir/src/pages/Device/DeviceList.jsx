import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Container, Table, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaQuestionCircle, FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const DeviceList = () => {
    const navigate = useNavigate();

    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [deviceSelecionado, setDeviceSelecionado] = useState(null);

    const [deleting, setDeleting] = useState(false);
    const [deleteErro, setDeleteErro] = useState(null);

    const abrirModal = (device) => {
        setModalAberto(true);
        setDeviceSelecionado(device);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setDeviceSelecionado(null);
    };

    const deleteDevice = async () => {
        if (deleting) return;
        const id = deviceSelecionado?.id;
        if (!id) return;

        try {
            setDeleting(true);
            setDeleteErro(null);
            await api.delete(`/device/${id}`);
            setDevices((prev) => prev.filter((d) => d?.id !== id));
            fecharModal();
        } catch (e) {
            const canceled =
                e?.name === 'CanceledError' ||
                e?.name === 'AbortError' ||
                e?.code === 'ERR_CANCELED';

            if (!canceled) {
                setDeleteErro('Houve um problema ao deletar o dispositivo.');
                console.error(e);
            }
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const ctrl = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setErro(null);
                const { data } = await api.get('/device', { signal: ctrl.signal });
                if (ctrl.signal.aborted) return;
                setDevices(Array.isArray(data) ? data : []);
            } catch (e) {
                const canceled =
                    e?.name === 'CanceledError' ||
                    e?.name === 'AbortError' ||
                    e?.code === 'ERR_CANCELED';
                if (!canceled) {
                    setErro('Houve um erro ao listar os dispositivos.');
                    console.error(e);
                }
            } finally {
                if (!ctrl.signal.aborted) setLoading(false);
            }
        })();

        return () => ctrl.abort();
    }, []);

    const fmtNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(5) : '-';
    };

    if (loading) return <Container>Carregando...</Container>;

    return (
        <Container fluid className="pt-5 d-flex flex-column p-5 h-100 bg-light">
            <div className="mx-auto" style={{ maxWidth: '1280px', width: '100%' }}>
                <div className="mb-4 d-flex justify-content-between">
                    <h2 className="d-flex align-items-center">
                        Lista de Dispositivos
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Veja todos os dispositivos cadastrados!</Tooltip>}
                        >
                            <FaQuestionCircle className="ms-2" />
                        </OverlayTrigger>
                    </h2>
                    <Button
                        onClick={() => navigate('/register-device')}
                        size="lg"
                        variant="primary"
                        className="d-flex align-items-center gap-2"
                    >
                        <FaPlus />
                        Adicionar Dispositivo
                    </Button>
                </div>

                {erro && <div className="alert alert-danger mb-3">{erro}</div>}
                {deleteErro && <div className="alert alert-danger mb-3">{deleteErro}</div>}

                <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Nome</th>
                            <th>MAC</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Tipo de Gás</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Nenhum dispositivo cadastrado.
                                </td>
                            </tr>
                        ) : (
                            devices.map((d) => (
                                <tr key={d.id ?? d.mac}>
                                    <td>{d.deviceName}</td>
                                    <td>{d.mac}</td>
                                    <td>{fmtNum(d.latitude)}</td>
                                    <td>{fmtNum(d.longitude)}</td>
                                    <td>{d.gasType}</td>
                                    <td className="d-flex gap-2 justify-content-center">
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            onClick={() => navigate(`/update-device/${d.id}`)}
                                            className='d-flex align-items-center'
                                        >
                                            <FaEdit className="me-1" />
                                            Editar
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="danger" 
                                            onClick={() => abrirModal(d)}
                                            className='d-flex align-items-center'
                                        >
                                            <FaTrash className="me-1" />
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                <Modal show={modalAberto} onHide={fecharModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="d-flex align-items-center">
                            <FaExclamationTriangle className="me-2 text-danger" />
                            Confirmar Exclusão!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Tem certeza que deseja excluir o dispositivo:{' '}
                        <strong>{deviceSelecionado?.deviceName}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={fecharModal} disabled={deleting}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={deleteDevice} disabled={deleting}>
                            {deleting ? 'Excluindo…' : 'Excluir'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
};

export default DeviceList;
