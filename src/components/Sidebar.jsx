import LAYER_CONFIG from "./layerConfig";

export default function Sidebar({
  layers,
  setLayers,
  openPage,
}) {
  const handleLayerChange = (
    key,
    checked
  ) => {
    setLayers((prev) => ({
      ...prev,

      [key]: checked,
    }));
  };

  return (
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
      }}
    >
      {/* LOGO */}

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

      {/* TITLE */}

      <h3
        style={{
          margin: "5px 0",
          color: "#222",
          textAlign: 'center',
          fontSize: "18px",
        }}
      >
        MAPA INTERATIVO
      </h3>

      {/* DESCRIPTION */}

      <p
        style={{
          fontSize: "13px",
          textAlign: 'center',
          color: "#222",

          lineHeight: 1.5,
        }}
      >
        Ative ou desative as camadas
        de visualização abaixo.
      </p>

      {/* DIVIDER 

      <hr
        style={{
          border: "none",

          height: "3px",

          background:
            "linear-gradient(to right, #ffc420, #f04434)",

          borderRadius: "999px",

          margin: "10px 0",
        }}
      />*/}


      {/* LAYER CONTROLS */}

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: "14px",
        }}
      >
        
{Object.entries(LAYER_CONFIG).map(
  ([key, config]) => {
    const layerType =
      config.style.type;

    const color =
      layerType === "circle"
        ? config.style.paint[
            "circle-color"
          ]
        : config.style.paint[
            "fill-color"
          ];

    return (
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
        <input
          type="checkbox"
          checked={layers[key]}
          onChange={(e) =>
            handleLayerChange(
              key,
              e.target.checked
            )
          }
          style={{
            display: "none",
          }}
        />

        {/* SYMBOL */}

        <div
          style={{
            width:
              layerType === "fill"
                ? "18px"
                : "10px",

            height:
              layerType === "fill"
                ? "12px"
                : "10px",

            borderRadius:
              layerType === "fill"
                ? "3px"
                : "50%",

            border: `2px solid ${color}`,

            backgroundColor:
              layers[key]
                ? color
                : "transparent",

            transition:
              "all 0.2s ease",
          }}
        />

        {/* LABEL */}

        <span
          style={{
            fontSize: "12px",

            fontWeight: 500,

            color: "#333",
          }}
        >
          {config.metadata.label}
        </span>
      </label>
    );
  }
)}
      </div>

      {/* DIVIDER */}

        <hr
          style={{
            border: "none",

            height: "3px",

            background:
              "linear-gradient(to right, #9ecd45, #f47431)",

            borderRadius: "999px",

            margin: "10px 0",
          }}
        />
      
      {/* MENU BUTTON */}

      <button
        onClick={() => openPage("about")}
        style={{
          width: "100%",

        //   marginBottom: "16px",

          padding: "10px",

          border: "none",

          borderRadius: "10px",

          background: "#ffc420",

          color: "white",
          fontWeight: 'bold',
          cursor: "pointer",
        }}
      >
        SOBRE O PROJETO
      </button>
    </div>
  );
}