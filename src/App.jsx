import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* =========================================================
   ✅ LAYER CONFIG
   Change colors, labels and files ONLY here
========================================================= */

const LAYER_CONFIG = {
  reintegracoes: {
    id: "reintegracoes-layer",
    source: "reintegracoes",
    label: "Reintegrações da Unidade Cível Central",
    color: "#d73027",
    file: `${import.meta.env.BASE_URL}reintegracoes.geojson`,
  },

  fundiarias_fazenda: {
    id: "fundiarias_fazenda-layer",
    source: "fundiarias_fazenda",
    label: "Fundiárias Fazenda Pública",
    color: "#fdae61",
    file: `${import.meta.env.BASE_URL}fundiarias_fazenda.geojson`,
  },

  retrofit: {
    id: "retrofit-layer",
    source: "retrofit",
    label: "Retrofit SEHAB",
    color: "#4575b4",
    file: `${import.meta.env.BASE_URL}retrofit.geojson`,
  },
};

export default function App() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  /* =========================================================
     ✅ INITIAL LAYER VISIBILITY STATE
  ========================================================= */

  const [layers, setLayers] = useState(
    Object.keys(LAYER_CONFIG).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  /* =========================================================
     ✅ MAP INITIALIZATION
  ========================================================= */

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,

      style:
        "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",

      center: [-46.63644661471924, -23.548922],

      zoom: 12,
    });

    mapRef.current = map;

    const hoveredIds = {};

    map.on("load", () => {
      /* =====================================================
         ✅ CREATE SOURCES + LAYERS
      ===================================================== */

      Object.entries(LAYER_CONFIG).forEach(([key, config]) => {
        map.addSource(config.source, {
          type: "geojson",
          data: config.file,
          generateId: true,
        });

        map.addLayer({
          id: config.id,

          type: "circle",

          source: config.source,

          paint: {
            /* ===============================
               Hover animation
            =============================== */

            "circle-radius": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              10,
              5,
            ],

            "circle-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.6,
              1,
            ],

            "circle-color": config.color,
          },
        });
      });

      /* =====================================================
         ✅ POPUP
      ===================================================== */

      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true,
      });

      function buildPopupContent(properties) {
        return `
          <div style="font-size:12px">
            <strong>Processo:</strong>
            ${properties["original_Nº PROCESSO"] || "-"}
          </div>
        `;
      }

      /* =====================================================
         ✅ EVENTS FOR ALL LAYERS
      ===================================================== */

      Object.entries(LAYER_CONFIG).forEach(([key, config]) => {
        /* ===============================
           CLICK → popup
        =============================== */

        map.on("click", config.id, (e) => {
          const feature = e.features[0];

          const coordinates =
            feature.geometry.coordinates.slice();

          popup
            .setLngLat(coordinates)
            .setHTML(buildPopupContent(feature.properties))
            .addTo(map);
        });

        /* ===============================
           HOVER
        =============================== */

        map.on("mousemove", config.id, (e) => {
          map.getCanvas().style.cursor = "pointer";

          if (!e.features.length) return;

          const feature = e.features[0];

          // remove previous hover
          if (hoveredIds[config.id] !== undefined) {
            map.setFeatureState(
              {
                source: config.source,
                id: hoveredIds[config.id],
              },
              {
                hover: false,
              }
            );
          }

          // set new hover
          hoveredIds[config.id] = feature.id;

          map.setFeatureState(
            {
              source: config.source,
              id: feature.id,
            },
            {
              hover: true,
            }
          );
        });

        /* ===============================
           REMOVE HOVER
        =============================== */

        map.on("mouseleave", config.id, () => {
          map.getCanvas().style.cursor = "";

          if (hoveredIds[config.id] !== undefined) {
            map.setFeatureState(
              {
                source: config.source,
                id: hoveredIds[config.id],
              },
              {
                hover: false,
              }
            );
          }

          hoveredIds[config.id] = undefined;
        });
      });
    });

    return () => map.remove();
  }, []);

  /* =========================================================
     ✅ TOGGLE VISIBILITY
  ========================================================= */

  const setLayerVisibility = (id, visible) => {
    const map = mapRef.current;

    if (!map || !map.getLayer(id)) return;

    map.setLayoutProperty(
      id,
      "visibility",
      visible ? "visible" : "none"
    );
  };

  const handleLayerChange = (
    layerKey,
    layerId,
    checked
  ) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: checked,
    }));

    setLayerVisibility(layerId, checked);
  };

  /* =========================================================
     ✅ UI
  ========================================================= */

  return (
    <>
      {/* =====================================================
          CONTROL PANEL
      ===================================================== */}

      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 10,

          width: "270px",

          backgroundColor: "white",

          padding: "16px",

          borderRadius: "14px",

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.15)",

          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        {/* ===============================
            LOGO
        =============================== */}

        <div
          style={{
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}obs_logo.png`}
            alt="Logo"
            style={{
              maxWidth: "210px",
            }}
          />
        </div>

        {/* ===============================
            TITLE
        =============================== */}

        <h3
          style={{
            margin: "5px 0",
            color: "#222",
            fontSize: "18px",
          }}
        >
          MAPA INTERATIVO
        </h3>

        {/* ===============================
            DESCRIPTION
        =============================== */}

        <p
          style={{
            fontSize: "13px",
            color: "#666",
            lineHeight: 1.5,
          }}
        >
          Ative ou desative as camadas
          de visualização abaixo.
        </p>

        {/* ===============================
            DIVIDER
        =============================== */}

        <hr
          style={{
            border: "none",
            height: "3px",
            background:
              "linear-gradient(to right, #ffc420, #f04434)",
            borderRadius: "999px",
            margin: "14px 0",
          }}
        />

        {/* ===============================
            LAYER CONTROLS
        =============================== */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {Object.entries(LAYER_CONFIG).map(
            ([key, config]) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",

                  gap: "12px",

                  cursor: "pointer",

                  userSelect: "none",
                }}
              >
                {/* hidden checkbox */}

                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(e) =>
                    handleLayerChange(
                      key,
                      config.id,
                      e.target.checked
                    )
                  }
                  style={{
                    display: "none",
                  }}
                />

                {/* custom circle */}

                <div
                  style={{
                    width: "10px",
                    height: "10px",

                    borderRadius: "50%",

                    border: `2px solid ${config.color}`,

                    backgroundColor:
                      layers[key]
                        ? config.color
                        : "transparent",

                    transition: "all 0.2s ease",
                  }}
                />

                {/* label */}

                <span
                  style={{
                    fontSize: "12px",

                    fontWeight: 500,

                    color: '#333',
                  }}
                >
                  {config.label}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {/* =====================================================
          MAP
      ===================================================== */}

      <div
        ref={mapContainer}
        style={{
          position: "fixed",

          top: 0,
          left: 0,

          width: "100%",
          height: "100vh",
        }}
      />
    </>
  );
}