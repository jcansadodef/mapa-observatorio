const LAYER_CONFIG = {
  // reintegracoes: {
  //   id: "reintegracoes-layer",

  //   zIndex: 13,

  //   source: {
  //     id: "reintegracoes",
  //     attribution:
  //       "Unidade Cível Central - mapeadas pelo observatório",
  //     type: "geojson",
  //     file: `${import.meta.env.BASE_URL}/layers/reintegracoes.geojson`,
  //   },

  //   metadata: {
  //     label:
  //       "Reintegrações da Unidade Cível Central",
  //   },

  //   style: {
  //     type: "circle",

  //     paint: {
  //       "circle-color": "#d73027",

  //       "circle-radius": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         10,
  //         5,
  //       ],

  //       "circle-opacity": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         0.6,
  //         1,
  //       ],
  //     },
  //   },

  //   interaction: {
  //     hover: true,
  //     popup: true,
  //     cursor: "pointer",
  //   },

  //   popupFields: {
  //     Processo: "original_Nº PROCESSO",
  //   },
  // },

  // fundiarias_fazenda: {
  //   id: "fundiarias_fazenda-layer",

  //   zIndex: 12,

  //   source: {
  //     id: "fundiarias_fazenda",
  //     attribution: "Fazenda Pública",
  //     type: "geojson",
  //     file: `${import.meta.env.BASE_URL}/layers/fundiarias_fazenda.geojson`,
  //   },

  //   metadata: {
  //     label: "Fundiárias Fazenda Pública",
  //   },

  //   style: {
  //     type: "circle",

  //     paint: {
  //       "circle-color": "#fee090",

  //       "circle-radius": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         10,
  //         5,
  //       ],

  //       "circle-opacity": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         0.6,
  //         1,
  //       ],
  //     },
  //   },

  //   interaction: {
  //     hover: true,
  //     popup: true,
  //     cursor: "pointer",
  //   },

  //   popupFields: {
  //     Processo: "original_PROCESSO",
  //   },
  // },

  // retrofit: {
  //   id: "retrofit-layer",

  //   zIndex: 11,

  //   source: {
  //     id: "retrofit",
  //     attribution: "SEHAB",
  //     type: "geojson",
  //     file: `${import.meta.env.BASE_URL}/layers/retrofit.geojson`,
  //   },

  //   metadata: {
  //     label: "Retrofit SEHAB",
  //   },

  //   style: {
  //     type: "circle",

  //     paint: {
  //       "circle-color": "#313695",

  //       "circle-radius": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         10,
  //         5,
  //       ],

  //       "circle-opacity": [
  //         "case",
  //         ["boolean", ["feature-state", "hover"], false],
  //         0.6,
  //         1,
  //       ],
  //     },
  //   },

  //   interaction: {
  //     hover: true,
  //     popup: true,
  //     cursor: "pointer",
  //   },

  //   popupFields: {
  //     Origem: "original_Origem",
  //   },
  // },

  ZEIS2014: {
    id: "zeis2014-layer",

    zIndex: 3,

    source: {
      id: "zeis_2014",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/zeis_pde2014.geojson`,
    },

    metadata: {
      label: "ZEIS 1, 2, 3, 4 e 5 - PDE 2014",
      group: "ZONEAMENTO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#f94144",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#f94144",
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

 ZEIS2016: {
    id: "zeis2016-layer",

    zIndex: 3,

    source: {
      id: "zeis_2016",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/zeis_2016.geojson`,
    },

    metadata: {
      label: "ZEIS 1, 2, 3, 4 e 5 - LPUOS 2016",
      group: "ZONEAMENTO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#f94144",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#f94144",
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

 ZEIS2024: {
    id: "zeis2024-layer",

    zIndex: 3,

    source: {
      id: "zeis_2024",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/zeis_2024.geojson`,
    },

    metadata: {
      label: "ZEIS 1, 2, 3, 4 e 5 - LPUOS 2024",
      group: "ZONEAMENTO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#f94144",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#f94144",
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
        "cd_zoneamento_perimetro",
    },
  },

  areas_publicas: {
    id: "areas_publicas-layer",

    zIndex: 2,

    source: {
      id: "areas_publicas",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/areas_publicas.geojson`,
    },

    metadata: {
      label: "CAP - Cadastro de Área Pública",
      group: "ÁREAS PÚBLICAS",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#f9c74f",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#f9c74f",
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
      file: `${import.meta.env.BASE_URL}layers/areas_cedidas.geojson`,
    },

    metadata: {
      label: "Áreas Cedidas",
      group: "ÁREAS PÚBLICAS",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#f8961e",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#f8961e",
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

  risco_hidrologico: {
    id: "risco-hidrologico-layer",

    zIndex: 1,

    source: {
      id: "risco_hidrologico",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/risco_hidrologico2.geojson`,
    },

    metadata: {
      label: "Risco Hidrológico",
      group: "RISCOS",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#277da1",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#277da1",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Tipo de processo hidrológico": "tx_tipo_processo",
      "Grau de Risco": "tx_grau_risco_hidrologico",
    },
  },

  risco_geologico: {
    id: "risco-geologico-layer",

    zIndex: 1,

    source: {
      id: "risco_geologico",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/risco_geologico2.geojson`,
    },

    metadata: {
      label: "Risco Geológico",
      group: "RISCOS",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#ca6702",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#ca6702",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Tipo de processo geológico": "tx_tipo_processo_geologico",
      "Grau de Risco": "tx_grau_de_risco_geologico",
    },
  },

  acoes_regularizacao: {
    id: "acoes-regularizacao-layer",

    zIndex: 1,

    source: {
      id: "acoes_regularizacao",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/hab_acao_regularizacao2.geojson`,
    },

    metadata: {
      label: "Ações de Regularização",
      group: "HABITAÇÃO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#84a98c",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#84a98c",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Nome": "nome",
      "Número Processo": "nro_processo",
    },
  },

  hab_loteamento: {
    id: "loteamento-layer",

    zIndex: 1,

    source: {
      id: "loteamento",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/hab_loteamento2.geojson`,
    },

    metadata: {
      label: "Loteamento Irregular",
      group: "HABITAÇÃO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#52796f",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#52796f",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Nome": "nome",
      "Número Proc. Adm.": "nro_pa",
      "Total de lotes": "tot_lotes",
      "Renda": "renda",
    },
  },

   hab_nucleo: {
    id: "nucleo-layer",

    zIndex: 1,

    source: {
      id: "nucleo",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/hab_nucleo2.geojson`,
    },

    metadata: {
      label: "Núcleo",
      group: "HABITAÇÃO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#354f52",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#354f52",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Nome": "nome",
      "Ano de Implantação": "ano_implant",
      "Propriedade Área": "propriedade_area",
      "Total de domicílios": "tot_domicilio",
    },
  },

 hab_favela: {
    id: "favela-layer",

    zIndex: 1,

    source: {
      id: "favela",
      attribution: "GeoSampa",
      type: "geojson",
      file: `${import.meta.env.BASE_URL}layers/hab_favela2.geojson`,
    },

    metadata: {
      label: "Favela",
      group: "HABITAÇÃO",
    },

    style: {
      type: "fill",

      paint: {
        "fill-color": "#2f3e46",

        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.4,
        ],
      },

      outline: {
        "line-color": "#2f3e46",
        "line-width": 2,
      },
    },

    interaction: {
      hover: true,
      popup: true,
      cursor: "pointer",
    },

    popupFields: {
      "Nome": "nome",
      "Número Processo": "nro_processo",
      "Ano de Implantação": "ano_implant",
      "Propriedade Área": "propriedade_area",
    },
  },

};

// Defines the accordion sections and the order layers appear inside each.
// Consumed by whatever component renders the layer-toggle sidebar/accordion.
export const LAYER_GROUPS = [
  {
    label: "ZONEAMENTO",
    layers: ["ZEIS2014", "ZEIS2016", "ZEIS2024"],
  },
  {
    label: "ÁREAS PÚBLICAS",
    layers: ["areas_publicas", "areas_cedidas"],
  },
  {
    label: "RISCOS",
    layers: ["risco_hidrologico", "risco_geologico"],
  },
  {
    label: "HABITAÇÃO",
    layers: [
      "acoes_regularizacao",
      "hab_loteamento",
      "hab_nucleo",
      "hab_favela",
    ],
  },
];

export default LAYER_CONFIG;