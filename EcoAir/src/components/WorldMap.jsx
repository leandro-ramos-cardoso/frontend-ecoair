import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { api } from "../services/api";
import { Container, Offcanvas, ListGroup, Button } from "react-bootstrap";
import { FaCloud } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { useNavigate } from "react-router-dom";

// Corrige ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function WorldMap() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // por MAC: { [mac]: { ppm, status, ... } }
  const [sensorData, setSensorData] = useState({});
  const [sensorLoading, setSensorLoading] = useState({});

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErro(null);
        const { data } = await api.get("/device", { signal: ctrl.signal });
        if (!ctrl.signal.aborted) setDevices(Array.isArray(data) ? data : []);
      } catch (e) {
        const canceled =
          e?.name === "CanceledError" || e?.name === "AbortError" || e?.code === "ERR_CANCELED";
        if (!canceled) {
          const status = e?.response?.status;
          setErro(
            status === 401 || status === 403
              ? "Acesso negado ou sessão expirada. Verifique as permissões da rota /device."
              : "Houve um erro ao carregar as informações iniciais."
          );
          console.error("Erro ao carregar /device:", e);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  // ---- Helpers de status/cores (BOA, MEDIA, RUIM baseados no último PPM) ----
  const statusFromPPM = (ppm) => {
    if (ppm == null) return "DESCONHECIDA";
    if (ppm < 50) return "BOA";
    if (ppm < 100) return "MEDIA";
    return "RUIM";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BOA":
        return "green";
      case "MEDIA":
        return "orange";
      case "RUIM":
        return "red";
      default:
        return "gray";
    }
  };

  const getQualityColor = (ppm) => {
    if (ppm == null) return "gray";
    if (ppm < 50) return "green";
    if (ppm < 100) return "orange";
    return "red";
  };

  const getStatusIcon = (status) =>
    new L.DivIcon({
      html: ReactDOMServer.renderToString(<FaCloud size={22} color={getStatusColor(status)} />),
      className: "",
      iconSize: [22, 22],
      iconAnchor: [11, 22],
      popupAnchor: [0, -22],
    });

  const OnlineBadge = ({ demo }) => {
    const isOnline = demo === false;
    const label = isOnline ? "Sensor Ativo" : "Sensor Demonstração";
    const color = isOnline ? "#16a34a" : "#dc2626"; // verde / vermelho
    const bg = isOnline ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)";
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          color,
          background: bg,
          padding: "4px 10px",
          borderRadius: 999,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            boxShadow: `0 0 0 2px ${bg}`,
          }}
        />
        {label}
      </span>
    );
  };

  // ---- Busca o ÚLTIMO registro do sensor e deriva status pela leitura ----
  const fetchSensorData = async (device) => {
    setSelectedDevice(device);
    setShowOffcanvas(true);

    const deviceMac = device.mac;
    setSensorLoading((prev) => ({ ...prev, [deviceMac]: true }));
    setSensorData((prev) => ({ ...prev, [deviceMac]: null }));

    try {
      const { data, status } = await api.get(
        `/sensor-data/${encodeURIComponent(device.mac)}/latest`
      );

      if (status === 204 || !data) {
        setSensorData((prev) => ({ ...prev, [deviceMac]: { empty: true } }));
        return;
      }

      const ppm = data.sensorValue;
      const statusByReading = statusFromPPM(ppm);

      setSensorData((prev) => ({
        ...prev,
        [deviceMac]: { ...data, ppm, status: statusByReading },
      }));
    } catch (e) {
      const st = e?.response?.status;
      if (st === 403) {
        setSensorData((prev) => ({
          ...prev,
          [deviceMac]: { error: true, reason: "forbidden" },
        }));
      } else if (st === 404) {
        setSensorData((prev) => ({ ...prev, [deviceMac]: { empty: true } }));
      } else {
        setSensorData((prev) => ({ ...prev, [deviceMac]: { error: true } }));
      }
      console.error(`Erro ao buscar dados do sensor para MAC ${deviceMac}:`, e);
    } finally {
      setSensorLoading((prev) => ({ ...prev, [deviceMac]: false }));
    }
  };

  const WORLD_BOUNDS = L.latLngBounds([-85, -180], [85, 180]);
  const sensorIsLoading = selectedDevice ? sensorLoading[selectedDevice.mac] : false;
  const currentSensorData = selectedDevice ? sensorData[selectedDevice.mac] : null;
  const currentPpm = currentSensorData?.ppm ?? null;
  const currentError = currentSensorData?.error ?? false;
  const currentStatus = currentSensorData?.status ?? "DESCONHECIDA";

  if (loading) return <div>Carregando mapa…</div>;
  if (erro) return <Container className="mt-4 text-danger">Erro: {erro}</Container>;

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
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />

          {devices.map((device) => {
            const latestStatus = sensorData[device.mac]?.status ?? device.deviceStatus ?? "DESCONHECIDA";
            return (
              <Marker
                key={device.id ?? device.mac}
                position={[device.latitude, device.longitude]}
                icon={getStatusIcon(latestStatus)}
                eventHandlers={{ click: () => fetchSensorData(device) }}
              >
                <Tooltip>
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong>{device.deviceName ?? "Dispositivo"}</strong>
                    <span>
                      Qualidade do ar (última leitura):{" "}
                      <strong>{sensorData[device.mac]?.status ?? "-"}</strong>
                    </span>
                    <span>
                      Conexão: <OnlineBadge demo={device.demo} />
                    </span>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {selectedDevice?.deviceName ?? "Detalhes do Dispositivo"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedDevice ? (
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Conexão:</strong> <OnlineBadge demo={selectedDevice.demo} />
              </ListGroup.Item>

              <ListGroup.Item>
                <strong>Qualidade do Ar (última leitura):</strong>{" "}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    color: getStatusColor(currentStatus),
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: getStatusColor(currentStatus),
                      display: "inline-block",
                    }}
                  />
                  {currentStatus}
                </span>
              </ListGroup.Item>

              <ListGroup.Item>
                <strong>MAC:</strong> {selectedDevice.mac}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Tipo de Gás:</strong> {selectedDevice.gasType ?? "-"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Latitude:</strong> {selectedDevice.latitude}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Longitude:</strong> {selectedDevice.longitude}
              </ListGroup.Item>

              <hr />
              <h6>Dados de Leitura:</h6>

              {sensorIsLoading ? (
                <ListGroup.Item className="text-primary">
                  Carregando dados do sensor...
                </ListGroup.Item>
              ) : currentError ? (
                <ListGroup.Item className="text-danger">
                  {currentSensorData?.reason === "forbidden"
                    ? "Acesso negado (403) para /sensor-data/{mac}/latest. Verifique autenticação/permissões."
                    : "Erro ao carregar dados. Verifique a API ou permissões."}
                </ListGroup.Item>
              ) : currentSensorData?.empty ? (
                <ListGroup.Item>Nenhuma leitura recente disponível para este dispositivo.</ListGroup.Item>
              ) : currentPpm != null ? (
                <>
                  <ListGroup.Item>
                    <strong>{selectedDevice?.gasType ?? "Gás"}:</strong>{" "}
                    <span style={{ color: getQualityColor(currentPpm), fontWeight: "bold" }}>
                      {currentPpm}
                    </span>
                  </ListGroup.Item>
                  {/* <Button onClick={() => navigate(`/dashboard/${selectedDevice?.id}`)} className="mt-4">
                    Dashboard
                  </Button> */}
                </>
              ) : (
                <ListGroup.Item>Nenhum dado disponível.</ListGroup.Item>
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
