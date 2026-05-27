"use client";

import { useEffect, useRef } from "react";
import type { Map, Marker } from "leaflet";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Abort if cleanup already ran or container already has a map
      if (cancelled || !mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((mapRef.current as any)._leaflet_id) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const customIcon = L.divIcon({
        html: `<div style="
          width: 32px; height: 32px;
          background: hsl(142.1, 76.2%, 36.3%);
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: "",
      });

      const initialLat = value?.lat ?? 10.1621;
      const initialLng = value?.lng ?? -67.9936;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      if (cancelled) {
        map.remove();
        return;
      }

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      if (value) {
        markerRef.current = L.marker([value.lat, value.lng], {
          icon: customIcon,
        }).addTo(map);
      }

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        }
        onChange({ lat, lng });
      });

      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden border-2 border-[--color-border] shadow-sm"
        style={{ height: 320 }}
      />
      {value ? (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: "hsl(142.1 76.2% 36.3% / 0.08)",
            border: "1px solid hsl(142.1 76.2% 36.3% / 0.2)",
          }}
        >
          <MapPin className="h-3.5 w-3.5 text-[--color-primary] flex-shrink-0" />
          <span className="text-xs font-mono text-[--color-foreground]">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </span>
          <span className="ml-auto text-xs text-[--color-primary] font-medium">Ubicación seleccionada</span>
        </div>
      ) : (
        <p className="text-xs text-[--color-muted-foreground] text-center py-1">
          Toca en el mapa para seleccionar la ubicación exacta del incendio
        </p>
      )}
    </div>
  );
}
