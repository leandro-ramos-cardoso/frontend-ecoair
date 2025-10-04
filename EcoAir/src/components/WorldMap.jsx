import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { api } from "../services/api";
import { Container, Table } from "react-bootstrap";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const OPENAQ_API_KEY = import.meta.env.VITE_OPENAQ_API_KEY;

export default function WorldMap() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false)
  const [devices, setDevices] = useState([])

  useEffect(() => {
  const ctrl = new AbortController();

  ;(async () => {
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
        setErro('Houve um erro ao carregar as informações.');
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

  const markers = devices.map(device => ({
    id: device.id ?? device.mac,
    position: [device.latitude, device.longitude],
    name: device.deviceName,
    gasType: device.gasType
    }));

  const smallIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Exemplo: ícone simples
        iconSize: [25, 25], // tamanho menor
        iconAnchor: [12, 25], // ponto que "gruda" no mapa
        popupAnchor: [0, -25]
    });

  return (

    /* <Container fluid className='pt-5 d-flex flex-column p-5 h-100 bg-light'>
      <div className="mx-auto" style={{ maxWidth: "1280px", width: "100%" }}>
        <Table striped bordered hover responsive className="align-middle text-center shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>id</th>
              <th>Device name</th>
              <th>MAC</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Gas type</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.map(device => (
                <tr key={device.id ?? device.mac}>
                  <td>{device.id}</td>
                  <td>{device.deviceName}</td>
                  <td>{device.mac}</td>
                  <td>{device.latitude}</td>
                  <td>{device.longitude}</td>
                  <td>{device.gasType}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    </Container> */

   <MapContainer center={[0, 0]} zoom={2} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
        />
        {devices.map(device => (
            <Marker
            key={device.id ?? device.mac}
            position={[device.latitude, device.longitude]}
            icon={smallIcon}
            >
                <Popup>
                    <strong>{device.deviceName ?? "Dispositivo"}</strong>
                    <br />
                    🕵️ ID: {device.id ?? device.mac}
                    <br />
                    📍 Lat: {device.latitude} | Lng: {device.longitude}
                    <br />
                    🔬 Gas: {device.gasType ?? "-"}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
  )
}