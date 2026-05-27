const LAYER_CONFIG = {
  reintegracoes: {
    id: "reintegracoes-layer",

    zIndex: 13,

    source: {
      id: "reintegracoes",
      attribution:
        "Unidade Cível Central - mapeadas pelo observatório",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}reintegracoes.geojson`,
    },

    metadata: {
      label:
        "Reintegrações da Unidade Cível Central",
    },

    style: {
      type: "circle",

      paint: {
        "circle-color": "#d73027",

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
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      Processo: "original_Nº PROCESSO",
    },
  },

  fundiarias_fazenda: {
    id: "fundiarias_fazenda-layer",

    zIndex: 12,

    source: {
      id: "fundiarias_fazenda",
      attribution: "Fazenda Pública",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}fundiarias_fazenda.geojson`,
    },

    metadata: {
      label: "Fundiárias Fazenda Pública",
    },

    style: {
      type: "circle",

      paint: {
        "circle-color": "#fee090",

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
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      Processo: "original_PROCESSO",
    },
  },

  retrofit: {
    id: "retrofit-layer",

    zIndex: 11,

    source: {
      id: "retrofit",
      attribution: "SEHAB",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}retrofit.geojson`,
    },

    metadata: {
      label: "Retrofit SEHAB",
    },

    style: {
      type: "circle",

      paint: {
        "circle-color": "#313695",

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
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      Origem: "original_Origem",
    },
  },

  ZEIS1: {
    id: "zeis1-layer",

    zIndex: 3,

    source: {
      id: "zeis1",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}zeis_gs.geojson`,
    },

    metadata: {
      label: "ZEIS 1 (GeoSampa)",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#a50026",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#a50026",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Código Zoneamento":
        "tx_zoneamento_perimetro",
    },
  },

  areas_publicas: {
    id: "areas_publicas-layer",

    zIndex: 2,

    source: {
      id: "areas_publicas",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}areas_publicas_gs.geojson`,
    },

    metadata: {
      label: "Áreas Públicas (GeoSampa)",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#fdae61",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#fdae61",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      Origem: "dc_tipo_or",
    },
  },

  areas_cedidas: {
    id: "areas_cedidas-layer",

    zIndex: 1,

    source: {
      id: "areas_cedidas",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}areas_cedidas_gs.geojson`,
    },

    metadata: {
      label: "Áreas Cedidas (GeoSampa)",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#abd9e9",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#abd9e9",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Tipo de cessão": "dc_tipo_ce",
    },
  },
};

export default LAYER_CONFIG;