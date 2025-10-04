import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const sensoresFake = [
  { id: 1, nome: "Sensor Brasil", coords: [-15.7801, -47.9292], co2: 412, temp: 27 },
  { id: 2, nome: "Sensor EUA", coords: [38.9072, -77.0369], co2: 420, temp: 23 },
  { id: 3, nome: "Sensor França", coords: [48.8566, 2.3522], co2: 415, temp: 19 },
];

const OPENAQ_API_KEY = import.meta.env.OPENAQ_API_KEY; // Substitua pela sua API Key

export default function WorldMap() {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    const fetchOpenAQData = async (sensor) => {
      try {
        const lat = sensor.coords[0];
        const lon = sensor.coords[1];

        const url = `https://api.openaq.org/v3/latest?coordinates=${lat},${lon}&radius=10000`;

        const res = await fetch(url, {
          headers: {
            "X-API-Key": OPENAQ_API_KEY
          }
        });

        const data = await res.json();
        // Pega o primeiro resultado e converte em um objeto mais simples
        const measurements = data.results?.[0]?.measurements || [];
        return { ...sensor, measurements };
      } catch (error) {
        console.error("Erro ao buscar OpenAQ:", error);
        return { ...sensor, measurements: [] };
      }
    };

    const carregarSensores = async () => {
      const sensoresComOpenAQ = await Promise.all(
        sensoresFake.map(sensor => fetchOpenAQData(sensor))
      );
      setSensores(sensoresComOpenAQ);
    };

    carregarSensores();
  }, []);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {sensores.map(sensor => (
        <Marker key={sensor.id} position={sensor.coords}>
          <Popup>
            <strong>{sensor.nome}</strong><br />
            🌍 Lat: {sensor.coords[0]} | Lon: {sensor.coords[1]} <br />
            💨 CO₂ local: {sensor.co2} ppm <br />
            🌡️ Temperatura: {sensor.temp} °C <br />
            <strong>OpenAQ:</strong><br />
            {sensor.measurements.length > 0
              ? sensor.measurements.map(m => (
                  <div key={m.parameter}>
                    {m.parameter}: {m.value} {m.unit}
                  </div>
                ))
              : "Sem dados OpenAQ"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}