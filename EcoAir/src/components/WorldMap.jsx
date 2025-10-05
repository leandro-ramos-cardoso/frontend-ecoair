import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { api } from "../services/api";
import { Container, Offcanvas, ListGroup } from "react-bootstrap";
import { FaCloud } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function WorldMap() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const [sensorData, setSensorData] = useState({});
  const [sensorLoading, setSensorLoading] = useState({});

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErro(null);
        const { data } = await api.get("/device", { signal: ctrl.signal });
        if (ctrl.signal.aborted) return;
        setDevices(Array.isArray(data) ? data : []);
      } catch (e) {
        const canceled =
          e?.name === "CanceledError" || e?.name === "AbortError" || e?.code === "ERR_CANCELED";

        if (!canceled) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) {
            setErro("Acesso negado ou sessão expirada. Verifique as permissões da rota /device.");
          } else {
            setErro("Houve um erro ao carregar as informações iniciais.");
          }
          console.error("Erro ao carregar /device:", e);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (loading) return <div>Carregando mapa…</div>;
  if (erro) return <Container className="mt-4 text-danger">Erro ao carregar dados: {erro}</Container>;

  const getQualityColor = (ppm) => {
    if (ppm == null) return "gray";
    if (ppm < 10) return "green";
    if (ppm <= 50) return "orange";
    return "red";
  };

  const getIcon = (ppm) =>
    new L.DivIcon({
      html: ReactDOMServer.renderToString(
        <FaCloud size={22} color={getQualityColor(ppm)} />
      ),
      className: "",
      iconSize: [22, 22],
      iconAnchor: [11, 22],
      popupAnchor: [0, -22],
    });

  const fetchSensorData = async (device) => {
    setSelectedDevice(device);
    handleShow();

    const deviceMac = device.mac;
    setSensorLoading(prev => ({ ...prev, [deviceMac]: true }));
    setSensorData(prev => ({ ...prev, [deviceMac]: null }));

    try {

      const { data } = await api.get(`/sensor-data?mac=${encodeURIComponent(device.mac)}`);

      const isArray = Array.isArray(data);
      const latestItem = isArray && data.length > 0 ? data[data.length - 1] : null;

      let latestData = null;

      if (latestItem) {
        latestData = {
          ...latestItem,
          ppm: latestItem.sensorValue
        };
      }

      setSensorData((prev) => ({
        ...prev,
        [deviceMac]: latestData
      }));

    } catch (e) {
      console.error(`Erro ao buscar dados do sensor para MAC ${deviceMac}:`, e);
      setSensorData((prev) => ({ ...prev, [deviceMac]: { error: true } }));
    } finally {
      setSensorLoading(prev => ({ ...prev, [deviceMac]: false }));
    }
  };

  const WORLD_BOUNDS = L.latLngBounds([-85, -180], [85, 180]);

  const sensorIsLoading = selectedDevice ? sensorLoading[selectedDevice.mac] : false;
  const currentSensorData = selectedDevice ? sensorData[selectedDevice.mac] : null;
  const currentPpm = currentSensorData?.ppm ?? null;
  const currentError = currentSensorData?.error ?? false;


  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "56px",
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "calc(100vh - 56px)",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[-7.11532, -34.861]}
          zoom={3}
          minZoom={3}
          maxZoom={18}
          maxBounds={WORLD_BOUNDS}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          whenReady={(ev) => ev.target.invalidateSize()}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
          />

          {devices.map((device) => {
            const sensor = sensorData[device.mac];
            const ppm = sensor?.ppm ?? null;

            return (
              <Marker
                key={device.id ?? device.mac}
                position={[device.latitude, device.longitude]}
                icon={getIcon(ppm)}
                eventHandlers={{ click: () => fetchSensorData(device) }}
              >
                <Tooltip>
                  Clique no marcador {device.deviceName ?? "Dispositivo"} para mais detalhes
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {selectedDevice?.deviceName ?? "Detalhes do Dispositivo"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedDevice ? (
            <ListGroup variant="flush">
              <ListGroup.Item><strong>MAC:</strong> {selectedDevice.mac}</ListGroup.Item>
              <ListGroup.Item><strong>Tipo de Gás:</strong> {selectedDevice.gasType ?? "-"}</ListGroup.Item>
              <ListGroup.Item><strong>Latitude:</strong> {selectedDevice.latitude}</ListGroup.Item>
              <ListGroup.Item><strong>Longitude:</strong> {selectedDevice.longitude}</ListGroup.Item>

              <hr />

              <h6>Dados de Leitura:</h6>

              {sensorIsLoading ? (
                <ListGroup.Item className="text-primary">Carregando dados do sensor...</ListGroup.Item>
              ) : currentError ? (
                <ListGroup.Item className="text-danger">Erro ao carregar dados. Verifique a API ou permissões.</ListGroup.Item>
              ) : currentPpm != null ? (
                <>
                  <ListGroup.Item>
                    <strong>PPM (Partes por Milhão):</strong>
                    <span style={{ color: getQualityColor(currentPpm), fontWeight: 'bold' }}> {currentPpm}</span>
                  </ListGroup.Item>
                </>
              ) : (
                <ListGroup.Item>Nenhum dado de leitura recente disponível.</ListGroup.Item>
              )}
            </ListGroup>
          ) : (
            <p>Selecione um marcador no mapa para ver os detalhes.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}