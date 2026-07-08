"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { OFFICE_LOCATION } from "@/lib/seedData";

export interface MapPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  emoji: string;
  subtitle?: string;
  rank?: number;
}

function pinIcon(pin: MapPin) {
  const size = pin.rank === 1 ? 34 : 26;
  const badge = pin.rank ? `<span style="position:absolute;top:-6px;left:-6px;background:linear-gradient(135deg,#6ea8ff,#a78bfa 55%,#ff8fc7);color:#150c2a;border-radius:999px;width:16px;height:16px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,.4)">${pin.rank}</span>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;font-size:${size}px;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55))">${pin.emoji}${badge}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapView({ pins }: { pins: MapPin[] }) {
  return (
    <MapContainer
      center={[OFFICE_LOCATION.lat, OFFICE_LOCATION.lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[OFFICE_LOCATION.lat, OFFICE_LOCATION.lng]}
        radius={9}
        pathOptions={{ color: "#a78bfa", fillColor: "#a78bfa", fillOpacity: 0.9, weight: 2 }}
      >
        <Popup>🏢 사무실 · {OFFICE_LOCATION.name}</Popup>
      </CircleMarker>
      {pins.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(p)}>
          <Popup>
            <b>{p.name}</b>
            {p.subtitle ? <div>{p.subtitle}</div> : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
