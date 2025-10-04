import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { api } from "../services/api";
import { Container } from "react-bootstrap";
import { FaCloud } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function WorldMap() {
  const [devices, setDevices] = useState([]);
  const [sensorData, setSensorData] = useState({}); // guarda ppm por deviceId
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

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
          e?.name === "CanceledError" ||
          e?.name === "AbortError" ||
          e?.code === "ERR_CANCELED";

        if (!canceled) {
          setErro("Houve um erro ao carregar as informações.");
          console.error(e);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  if (loading) return <div>Carregando mapa…</div>;
  if (erro) return <Container>Erro ao carregar dados...</Container>

   const getQualityColor = (ppm) => {
    if (ppm == null) return "gray";
    if (ppm < 10) return "green"; // BOM
    if (ppm <= 50) return "orange"; // MÉDIO
    return "red"; // RUIM
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

     const fetchSensorData = async (id) => {
        try {
        const { data } = await api.get(`/sensor-data/${mac}`);
        // supondo que backend retorna algo como { ppm: 12, timestamp: "2025-10-04T12:00:00Z" }
        setSensorData((prev) => ({ ...prev, [id]: data }));
        } catch (e) {
        console.error("Erro ao buscar dados do sensor", e);
        }
    };

  return (
   <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {devices.map((device) => {
        const sensor = sensorData[device.id];
        const ppm = sensor?.ppm ?? null;

        return (
          <Marker
            key={device.id ?? device.mac}
            position={[device.latitude, device.longitude]}
            icon={getIcon(ppm)}
            eventHandlers={{
              click: () => fetchSensorData(device.mac),
            }}
          >
            <Popup>
              <strong>{device.deviceName ?? "Dispositivo"}</strong>
              <br />
              Latitude: {device.latitude}
              <br />
              Longitude: {device.longitude}
              <br />
              Gas: {device.gasType ?? "-"}
              <br />
              {sensor ? (
                <>
                  <hr />
                  <strong>Última leitura:</strong> {sensor.ppm} ppm
                  <br />
                  Qualidade:{" "}
                  <span style={{ color: getQualityColor(sensor.ppm) }}>
                    {sensor.ppm < 10
                      ? "BOM (seguro)"
                      : sensor.ppm <= 50
                      ? "MÉDIO (atenção)"
                      : "RUIM (perigo)"}
                  </span>
                  <br />
                  ⏱ {new Date(sensor.timestamp).toLocaleString()}
                </>
              ) : (
                <em>Clique no marcador para carregar dados...</em>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  )
}