import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Corrigir ícones padrão do Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Dados fake simulando sensores no mundo
const sensoresFake = [
  { id: 1, nome: "Sensor Brasil", coords: [-15.7801, -47.9292], co2: 412, temp: 27 },
  { id: 2, nome: "Sensor EUA", coords: [38.9072, -77.0369], co2: 420, temp: 23 },
  { id: 3, nome: "Sensor França", coords: [48.8566, 2.3522], co2: 415, temp: 19 },
  { id: 4, nome: "Sensor Japão", coords: [35.6895, 139.6917], co2: 418, temp: 21 },
  { id: 5, nome: "Sensor África do Sul", coords: [-26.2041, 28.0473], co2: 410, temp: 25 }
];

export default function WorldMap() {
  const [sensores, setSensores] = useState([]);

  // Simula fetch de dados do backend/NASA
  useEffect(() => {
    setTimeout(() => {
      setSensores(sensoresFake);
    }, 1000);
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {sensores.map(sensor => (
        <Marker key={sensor.id} position={sensor.coords}>
          <Popup>
            <strong>{sensor.nome}</strong><br />
            🌍 Latitude: {sensor.coords[0]} | Longitude: {sensor.coords[1]} <br />
            🌡️ Temperatura: {sensor.temp} °C <br />
            💨 CO₂: {sensor.co2} ppm
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}