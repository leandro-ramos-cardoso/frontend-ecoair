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

  // useEffect(() => {
  //   const fetchOpenAQForAll = async () => {
  //     if (!OPENAQ_API_KEY) return;

  //     const batched = await Promise.allSettled(
  //       stations.map(async (s) => {
  //         const url = `https://api.openaq.org/v3/latest?coordinates=${s.lat},${s.lng}&radius=10000`;
  //         const r = await fetch(url, { headers: { "X-API-Key": OPENAQ_API_KEY } });
  //         const data = await r.json();
  //         const measurements = data?.results?.[0]?.measurements ?? [];
  //         return { id: s.id, measurements };
  //       })
  //     );

  //     setStations((prev) =>
  //       prev.map((st) => {
  //         const hit = batched.find(
  //           (b) => b.status === "fulfilled" && b.value.id === st.id
  //         );
  //         if (hit?.status === "fulfilled") {
  //           return { ...st, measurements: hit.value.measurements };
  //         }
  //         return { ...st, measurements: [] };
  //       })
  //     );
  //   };

  //   if (stations.length) {
  //     fetchOpenAQForAll();
  //   }
  // }, [stations.length]);

  if (loading) return <div>Carregando mapa…</div>;
  if (erro) return <Container>Erro ao carregar dados...</Container>

  return (

    <Container fluid className='pt-5 d-flex flex-column p-5 h-100 bg-light'>
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
    </Container>
    // <MapContainer center={center} zoom={2} style={{ height: "100vh", width: "100%" }}>
    //   <TileLayer
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     attribution="&copy; OpenStreetMap contributors"
    //   />
    //   {stations.map((s) => (
    //     <Marker key={s.id} position={[s.lat, s.lng]}>
    //       <Popup>
    //         <strong>{s.name ?? "Estação"}</strong>
    //         <br />
    //         País: {s.countryName ?? s.countryCode ?? "-"}
    //         <br />
    //         🕓 TZ: {s.timezone ?? "-"}
    //         <br />
    //         📍 Lat: {s.lat} | Lng: {s.lng}
    //         <br />
    //         <strong>Parâmetros:</strong>{" "}
    //         {Array.isArray(s.parameters) && s.parameters.length
    //           ? s.parameters.join(", ")
    //           : "-"}
    //         <br />
    //         {Array.isArray(s.measurements) && s.measurements.length > 0 ? (
    //           <>
    //             <strong>OpenAQ (últimas leituras):</strong>
    //             {s.measurements.map((m) => (
    //               <div key={`${m.parameter}-${m.value}`}>
    //                 {m.parameter}: {m.value} {m.unit}
    //               </div>
    //             ))}
    //           </>
    //         ) : (
    //           <em>Sem dados OpenAQ nesta busca</em>
    //         )}
    //       </Popup>
    //     </Marker>
    //   ))}
    // </MapContainer>
  )
}