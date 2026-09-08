import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LAYER_CONFIG from "./layerConfig";

export default function MapView({ layers, consultationPoint, onMapClick }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Reference for the consultation pin

  function buildPopupContent(properties, fields) {
    return `
      <div style="font-size:12px">
        ${Object.entries(fields)
          .map(
            ([label, property]) => `
              <div>
                <strong>${label}:</strong>
                ${properties[property] || "-"}
              </div>
            `
          )
          .join("")}
      </div>
    `;
  }

  /* =========================
     MAP INITIALIZATION
  ========================= */
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [-46.63644661471924, -23.548922],
      zoom: 12,
    });
    mapRef.current = map;

    const hoveredIds = {};

    map.on("load", () => {
      Object.entries(LAYER_CONFIG)
        .sort(([, a], [, b]) => (a.zIndex || 0) - (b.zIndex || 0))
        .forEach(([key, config]) => {
          
          map.addSource(config.source.id, {
            type: config.source.type,
            data: config.source.file,
            generateId: true,
          });

          map.addLayer({
            id: config.id,
            type: config.style.type,
            source: config.source.id,
            layout: { visibility: layers[key] ? "visible" : "none" },
            paint: config.style.paint,
          });

          if (config.style.outline) {
            map.addLayer({
              id: `${config.id}-outline`,
              type: "line",
              source: config.source.id,
              layout: { visibility: layers[key] ? "visible" : "none" },
              paint: config.style.outline,
            });
          }

          if (config.interaction.popup) {
            const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });
            map.on("click", config.id, (e) => {
              if (!e.features.length) return;
              const feature = e.features[0];
              let coordinates = feature.geometry.type === "Point" 
                ? feature.geometry.coordinates.slice() 
                : e.lngLat;

              popup
                .setLngLat(coordinates)
                .setHTML(buildPopupContent(feature.properties, config.popupFields))
                .addTo(map);
            });
          }

          if (config.interaction.hover) {
            map.on("mousemove", config.id, (e) => {
              if (config.interaction.cursor) {
                map.getCanvas().style.cursor = config.interaction.cursor;
              }
              if (!e.features.length) return;
              const feature = e.features[0];

              if (hoveredIds[config.id] !== undefined) {
                map.setFeatureState(
                  { source: config.source.id, id: hoveredIds[config.id] },
                  { hover: false }
                );
              }
              hoveredIds[config.id] = feature.id;
              map.setFeatureState(
                { source: config.source.id, id: feature.id },
                { hover: true }
              );
            });

            map.on("mouseleave", config.id, () => {
              map.getCanvas().style.cursor = "";
              if (hoveredIds[config.id] !== undefined) {
                map.setFeatureState(
                  { source: config.source.id, id: hoveredIds[config.id] },
                  { hover: false }
                );
              }
              hoveredIds[config.id] = undefined;
            });
          }
        });
    });

    return () => map.remove();
  }, []);

  /* =========================
     CONSULTATION CLICK & MARKER
  ========================= */
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    // Fire event on map click
    const handleMapClick = (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng, recenter: false });
      }
    };

    map.on("click", handleMapClick);
    return () => map.off("click", handleMapClick);
  }, [onMapClick]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (consultationPoint) {
      // Create or update marker
      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: "#ffc420" })
          .setLngLat([consultationPoint.lng, consultationPoint.lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([consultationPoint.lng, consultationPoint.lat]);
      }

      // Fly to location if it came from an address search
      if (consultationPoint.recenter) {
        map.flyTo({ center: [consultationPoint.lng, consultationPoint.lat], zoom: 16 });
      }
    } else {
      // Remove marker if consultation is cleared
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [consultationPoint]);

  /* =========================
     VISIBILITY UPDATE
  ========================= */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(LAYER_CONFIG).forEach(([key, config]) => {
      if (map.getLayer(config.id)) {
        map.setLayoutProperty(config.id, "visibility", layers[key] ? "visible" : "none");
      }
      if (config.style.outline && map.getLayer(`${config.id}-outline`)) {
        map.setLayoutProperty(`${config.id}-outline`, "visibility", layers[key] ? "visible" : "none");
      }
    });
  }, [layers]);

  return (
    <div
      ref={mapContainer}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh" }}
    />
  );
}