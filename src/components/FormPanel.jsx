import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import CloseButton from "./CloseButton";
import LAYER_CONFIG from "./layerConfig";

// Built from layerConfig.js so this can't drift out of sync with the map's
// real layers/filenames (that's what caused the zeis_gs.geojson 404 before).
// popupFields is carried along so we can show the same properties here that
// show up in the map's click popups.
const LAYERS = Object.entries(LAYER_CONFIG).map(([key, cfg]) => ({
  key,
  label: cfg.metadata.label,
  group: cfg.metadata.group,
  file: cfg.source.file,
  popupFields: cfg.popupFields || {},
}));

export default function FormPanel({ open, onClose, consultationPoint, setConsultationPoint }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Info Form States
  const [communityAge, setCommunityAge] = useState("");
  const [reportText, setReportText] = useState("");
  
  // Consultation State
  const layerDataRef = useRef({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Address Search State
  const [addressQuery, setAddressQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Helper to load GeoJSONs for turf
  async function loadLayer(file) {
    if (layerDataRef.current[file]) return layerDataRef.current[file];
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Falha ao carregar ${file} (HTTP ${res.status})`);

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("json")) {
      // Catches the case where the file is missing and the dev server / host
      // falls back to serving index.html with a 200 status — without this
      // check that produces a confusing "Unexpected token '<'" error instead.
      throw new Error(`Resposta inesperada para ${file} (esperava JSON, recebeu ${contentType})`);
    }

    const geojson = await res.json();
    layerDataRef.current[file] = geojson;
    return geojson;
  }

  // Run the turf.js intersection whenever consultationPoint changes
  useEffect(() => {
    if (!consultationPoint) {
      setResults(null);
      return;
    }

    async function runQuery() {
      setLoading(true);
      setError(null);
      setResults(null);
      
      const clickPoint = turf.point([consultationPoint.lng, consultationPoint.lat]);
      // Define a click tolerance (e.g., 0.05 kilometers = 50 meters)
      const TOLERANCE_KM = 0.05; 

      try {
        const perLayer = await Promise.all(
          LAYERS.map(async (layer) => {
            try {
              const geojson = await loadLayer(layer.file);

              let invalidGeometryCount = 0;

              const matches = geojson.features.filter((feature) => {
                try {
                  const geomType = feature.geometry?.type;

                  // 1. Polygons: keep using point in polygon (exact match)
                  if (geomType === "Polygon" || geomType === "MultiPolygon") {
                    return turf.booleanPointInPolygon(clickPoint, feature);
                  }

                  // 2. Points: check if the distance is within our tolerance
                  else if (geomType === "Point") {
                    return turf.distance(clickPoint, feature) <= TOLERANCE_KM;
                  }

                  // 3. MultiPoints: check if ANY point is within tolerance
                  else if (geomType === "MultiPoint") {
                    return feature.geometry.coordinates.some(coord =>
                      turf.distance(clickPoint, turf.point(coord)) <= TOLERANCE_KM
                    );
                  }

                  // 4. Lines (just in case you have streets/rivers later)
                  else if (geomType === "LineString" || geomType === "MultiLineString") {
                    return turf.pointToLineDistance(clickPoint, feature) <= TOLERANCE_KM;
                  }

                  return false;
                } catch (geomErr) {
                  // Malformed geometry (e.g. bad ring winding, self-intersection)
                  // makes turf throw for that feature. Count it instead of
                  // silently dropping it, so a whole layer that never matches
                  // anywhere isn't mistaken for "genuinely no intersection".
                  invalidGeometryCount += 1;
                  if (import.meta.env.DEV) {
                    console.warn(`Geometria inválida em ${layer.label}:`, geomErr);
                  }
                  return false;
                }
              });
              return {
                key: layer.key,
                label: layer.label,
                group: layer.group,
                count: matches.length,
                matches,
                popupFields: layer.popupFields,
                invalidGeometryCount,
              };
            } catch (layerErr) {
              // One bad/missing layer shouldn't kill the whole query — surface
              // it inline on that row instead.
              return {
                key: layer.key,
                label: layer.label,
                group: layer.group,
                count: 0,
                layerError: layerErr.message || String(layerErr),
              };
            }
          })
        );
        setResults(perLayer);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    
    runQuery();
  }, [consultationPoint]);

  // Handle address geocoding
  async function handleAddressSearch(e) {
    e.preventDefault();
    const query = addressQuery.trim();
    if (!query) return;

    setSearching(true);
    setSearchError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
        countrycodes: "br",
        viewbox: "-46.83,-23.35,-46.35,-24.00",
        bounded: "0",
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Falha na busca do endereço");
      const data = await res.json();

      if (!data.length) {
        setSearchError("Endereço não encontrado. Tente incluir bairro e 'São Paulo'.");
        return;
      }

      const { lat, lon } = data[0];
      // Update App state - this drops the marker and triggers the turf query above
      setConsultationPoint({ lat: parseFloat(lat), lng: parseFloat(lon), recenter: true });
    } catch (err) {
      setSearchError(err.message || String(err));
    } finally {
      setSearching(false);
    }
  }

  // Pulls every value of a given popup field label (e.g. "Nome") across all
  // matched features of a layer result. A layer can, in principle, have more
  // than one matched feature at the same point (overlapping polygons).
  function getFieldValues(result, fieldLabel) {
    const property = result.popupFields?.[fieldLabel];
    if (!property || !result.matches) return [];
    return result.matches
      .map((f) => f.properties?.[property])
      .filter((v) => v !== undefined && v !== null && String(v).trim() !== "");
  }

  // Same idea, but matches by substring in the field label instead of an
  // exact label — used for "Ano de Implantação" vs the "Ano de Iplantação"
  // typo in one of the layers, so both are picked up without hardcoding both.
  function getFieldValuesByLabelContains(result, substring) {
    if (!result.popupFields || !result.matches) return [];
    const normalizedSubstring = substring
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const matchingLabels = Object.keys(result.popupFields).filter((label) =>
      label
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedSubstring)
    );
    return matchingLabels.flatMap((label) => getFieldValues(result, label));
  }

  // "ZEIS 1, 2, 3, 4 e 5 - PDE 2014" -> "PDE 2014"
  function extractYearLabel(layerLabel) {
    const parts = layerLabel.split(" - ");
    return parts.length > 1 ? parts[parts.length - 1] : layerLabel;
  }

  // Joins a list of items the natural way: "A", "A e B", "A, B e C".
  function joinNatural(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    return items.slice(0, -1).join(", ") + " e " + items[items.length - 1];
  }

  // "na camada X" for one layer, "nas camadas X, Y e Z" for several.
  function layerReference(layerLabels) {
    return layerLabels.length === 1
      ? `na camada ${layerLabels[0]}`
      : `nas camadas ${joinNatural(layerLabels)}`;
  }

  function handleGenerateReport() {
    const hits = results ? results.filter((r) => r.count > 0 && !r.layerError) : [];

    if (hits.length === 0) {
      setReportText(
        "Não foram identificadas intersecções com as camadas consultadas para o ponto informado."
      );
      return;
    }

    const zeisHits = hits.filter((r) => r.group === "ZONEAMENTO");
    const habitacaoHits = hits.filter((r) => r.group === "HABITAÇÃO");
    const outrasHits = hits.filter(
      (r) => r.group !== "ZONEAMENTO" && r.group !== "HABITAÇÃO"
    );

    const paragraphs = [];

    // --- 1. ZEIS: one classification per legislative year, not one per hit ---
    if (zeisHits.length > 0) {
      const zeisDetails = zeisHits.map((r) => {
        const codes = getFieldValues(r, "Código Zoneamento");
        const yearLabel = extractYearLabel(r.label);
        const codeText = codes.length ? codes.join("/") : "não especificada";
        return `${codeText}, conforme ${yearLabel}`;
      });
      paragraphs.push(
        `A área estudada está inserida em Zona Especial de Interesse Social (ZEIS), com as seguintes classificações: ${zeisDetails.join("; ")}.`
      );
    }

    // --- 2. Habitação: dedupe by "Nome" across layers; flag divergences ---
    if (habitacaoHits.length > 0) {
      const byName = {}; // nome -> [layer labels where it appears]
      const unnamed = [];

      habitacaoHits.forEach((r) => {
        const names = getFieldValues(r, "Nome");
        if (names.length === 0) {
          unnamed.push(r.label);
          return;
        }
        names.forEach((name) => {
          if (!byName[name]) byName[name] = [];
          byName[name].push(r.label);
        });
      });

      const nameEntries = Object.entries(byName);

      if (nameEntries.length === 1) {
        const [name, layerLabels] = nameEntries[0];
        paragraphs.push(
          `A comunidade é identificada, de forma convergente, como "${name}" ${layerReference(layerLabels)}.`
        );
      } else if (nameEntries.length > 1) {
        const divergent = nameEntries
          .map(([name, layerLabels]) => `"${name}" (${joinNatural(layerLabels)})`)
          .join("; ");
        paragraphs.push(
          `Há divergência de denominação entre as bases consultadas: ${divergent}. Recomenda-se confirmar a identidade da área junto aos órgãos competentes.`
        );
      }

      if (unnamed.length > 0) {
        paragraphs.push(
          `A área também consta ${layerReference(unnamed)}, sem denominação registrada no respectivo cadastro.`
        );
      }

      // --- 3. Ano de Implantação: earliest official year, reconciled with resident-reported time ---
      const implantacoes = [];
      habitacaoHits.forEach((r) => {
        getFieldValuesByLabelContains(r, "implant").forEach((rawYear) => {
          const year = parseInt(rawYear, 10);
          if (!Number.isNaN(year)) implantacoes.push({ year, layer: r.label });
        });
      });

      if (implantacoes.length > 0) {
        const earliest = implantacoes.reduce((a, b) => (a.year < b.year ? a : b));
        const officialYears = new Date().getFullYear() - earliest.year;

        paragraphs.push(
          `De acordo com a camada "${earliest.layer}", a ocupação foi implantada em ${earliest.year}, o que indica, com base em registro oficial, um tempo de existência de aproximadamente ${officialYears} anos.`
        );

        if (communityAge.trim()) {
          paragraphs.push(
            `Em conversa com os moradores, foi relatado tempo de existência de ${communityAge.trim()}. Essa informação, de origem extrajudicial, deve ser cotejada com o registro oficial acima referido para fins de instrução processual.`
          );
        }
      } else if (communityAge.trim()) {
        paragraphs.push(
          `Não foi localizado, nas camadas consultadas, registro oficial de ano de implantação. Em conversa com os moradores, foi relatado que a comunidade existe há ${communityAge.trim()}, informação obtida por via extrajudicial e sujeita a confirmação.`
        );
      }

      // --- 4. Every other Habitação attribute (process numbers, unit counts,
      // income, ownership, anything else) — grouped by meaning where the
      // fields clearly relate to each other, rather than one field per layer.
      const processNumbers = [];
      const unitCounts = [];
      const incomeInfo = [];
      const ownershipInfo = [];
      const otherFields = [];

      habitacaoHits.forEach((r) => {
        Object.keys(r.popupFields || {}).forEach((fieldLabel) => {
          const normalized = fieldLabel
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

          // Already covered above — skip so they aren't repeated.
          if (normalized === "nome" || normalized.includes("implant")) return;

          const values = getFieldValues(r, fieldLabel);
          if (values.length === 0) return;

          if (normalized.includes("proc")) {
            values.forEach((v) => processNumbers.push({ value: v, layer: r.label }));
          } else if (normalized.includes("total de lote")) {
            values.forEach((v) => unitCounts.push({ value: v, unit: "lotes", layer: r.label }));
          } else if (normalized.includes("total de domicilio")) {
            values.forEach((v) => unitCounts.push({ value: v, unit: "domicílios", layer: r.label }));
          } else if (normalized.includes("renda")) {
            values.forEach((v) => incomeInfo.push({ value: v, layer: r.label }));
          } else if (normalized.includes("propriedade")) {
            values.forEach((v) => ownershipInfo.push({ value: v, layer: r.label }));
          } else {
            values.forEach((v) => otherFields.push({ label: fieldLabel, value: v, layer: r.label }));
          }
        });
      });

      if (processNumbers.length > 0) {
        const text = processNumbers.map((p) => `${p.value} (${p.layer})`).join(", ");
        paragraphs.push(
          `Foram identificados os seguintes números de processo administrativo relacionados à área: ${text}.`
        );
      }

      if (unitCounts.length > 0) {
        // Lotes and domicílios both describe the scale of the occupation, so
        // they're reported together in one sentence rather than split apart.
        const text = unitCounts.map((u) => `${u.value} ${u.unit} (${u.layer})`).join(", ");
        paragraphs.push(
          `Quanto à dimensão da ocupação, os cadastros indicam: ${text}.`
        );
      }

      if (incomeInfo.length > 0) {
        const text = incomeInfo.map((i) => `${i.value} (${i.layer})`).join(", ");
        paragraphs.push(
          `Em relação à renda da população residente, consta o seguinte registro: ${text}.`
        );
      }

      if (ownershipInfo.length > 0) {
        const text = ownershipInfo.map((o) => `${o.value} (${o.layer})`).join(", ");
        paragraphs.push(
          `Quanto à propriedade da área, os cadastros indicam: ${text}.`
        );
      }

      if (otherFields.length > 0) {
        const text = otherFields.map((f) => `${f.label}: ${f.value} (${f.layer})`).join("; ");
        paragraphs.push(`Constam ainda os seguintes registros nos cadastros consultados: ${text}.`);
      }
    } else if (communityAge.trim()) {
      // No habitação layer hit at all, but the user still supplied resident-reported time.
      paragraphs.push(
        `Em conversa com os moradores, foi relatado que a comunidade existe há ${communityAge.trim()}, informação obtida por via extrajudicial e sujeita a confirmação.`
      );
    }

    // --- 5. Everything else (riscos, áreas públicas, etc.): report properties inline ---
    outrasHits.forEach((r) => {
      const fieldEntries = Object.keys(r.popupFields || {});
      if (fieldEntries.length === 0) {
        paragraphs.push(`A área intersecta a camada "${r.label}".`);
        return;
      }

      const perFeature = r.matches.map((f) =>
        fieldEntries
          .map((label) => `${label}: ${f.properties?.[r.popupFields[label]] ?? "não informado"}`)
          .join("; ")
      );

      paragraphs.push(
        `A área intersecta a camada "${r.label}" (${perFeature.join(" | ")}).`
      );
    });

    setReportText(paragraphs.join("\n\n"));
  }

  const hits = results ? results.filter((r) => r.count > 0) : [];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: open ? 0 : "-420px",
        width: "400px",
        height: "100vh",
        background: "white",
        zIndex: 30,
        transition: "right 0.3s ease",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
        overflowY: "auto",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <CloseButton onClick={onClose} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
          GUIA DE ATUAÇÃO PROCESSUAL NOS CONFLITOS FUNDIÁRIOS
        </h3>
        <p style={{ margin: 0, textAlign: "center", fontSize: "13px" }}>
        O presente mapa interativo constitui uma ferramenta de consulta e orientação que sistematiza o Guia de Atuação Processual nos Conflitos Fundiários da Defensoria Pública do Estado de São Paulo.        
        </p>

        {/* --- SECTION 1: MAPA --- */}
        <button
          type="button"
          onClick={() => setIsMapOpen(!isMapOpen)}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "10px",
            background: "#ffc420",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isMapOpen ? "FECHAR" : "ABRIR"} LOCALIZAR ÁREA DE ATUAÇÃO
        </button>

        {isMapOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", border: "1px solid #eee", borderRadius: "10px" }}>
            <p style={{ lineHeight: 1.7, color: "#444", textAlign: "justify", margin: 0 }}>
              Localize a área estudada no mapa clicando nele ou buscando abaixo:
            </p>

            {/* Address Search */}
            <form onSubmit={handleAddressSearch} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => setAddressQuery(e.target.value)}
                placeholder="Digite um endereço em SP..."
                style={{ flex: 1, border: "1px solid #ddd", borderRadius: "6px", padding: "8px", fontSize: "13px" }}
              />
              <button
                type="submit"
                disabled={searching}
                style={{
                  padding: "8px 12px", border: "none", borderRadius: "6px", background: "#ffc420",
                  color: "#fff", fontWeight: "bold", cursor: searching ? "default" : "pointer", opacity: searching ? 0.7 : 1
                }}
              >
                {searching ? "..." : "Buscar"}
              </button>
            </form>
            {searchError && <div style={{ fontSize: "12px", color: "#c0392b" }}>{searchError}</div>}

            {/* Consultation Results */}
            <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginTop: "8px" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Camadas neste ponto</h4>
              
              {!consultationPoint && !loading && (
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Clique no mapa ou busque um endereço para consultar as camadas.</p>
              )}
              {loading && <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>Consultando...</p>}
              {error && <p style={{ fontSize: "12px", color: "#c0392b", margin: 0 }}>{error}</p>}
              
              {results && !loading && (
                <>
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 12px 0" }}>
                    {hits.length} de {results.length} camadas intersectam este ponto.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {results.map((r) => (
                      <div key={r.label} style={{
                        border: "1px solid " + (r.count > 0 ? "#ffc420" : "#ddd"),
                        background: r.count > 0 ? "#fffaf0" : "#fff",
                        borderRadius: "6px", padding: "8px", fontSize: "12px"
                      }}>
                        <div style={{ fontWeight: "bold", color: r.count > 0 ? "#b8860b" : "#333" }}>{r.label}</div>
                        <div>
                          {r.layerError
                            ? `⚠️ Erro ao carregar camada`
                            : r.count > 0
                            ? `Intersecta (${r.count})`
                            : "— Não intersecta"}
                        </div>

                        {r.invalidGeometryCount > 0 && (
                          <div style={{ color: "#c0392b", marginTop: "4px" }}>
                            ⚠️ {r.invalidGeometryCount} feição(ões) com geometria inválida foram ignoradas nesta camada.
                          </div>
                        )}

                        {/* Show the configured popup properties for each matched feature */}
                        {r.count > 0 && r.matches && Object.keys(r.popupFields || {}).length > 0 && (
                          <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {r.matches.map((feature, idx) => (
                              <div
                                key={idx}
                                style={{
                                  paddingLeft: "8px",
                                  borderLeft: "2px solid #ffc420",
                                }}
                              >
                                {Object.entries(r.popupFields).map(([fieldLabel, property]) => (
                                  <div key={fieldLabel}>
                                    <strong>{fieldLabel}:</strong>{" "}
                                    {feature.properties?.[property] ?? "-"}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

{/* --- SECTION 2: INFORMAÇÕES COMPLEMENTARES --- */}
        <button
          type="button"
          onClick={() => setIsInfoOpen(!isInfoOpen)}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "10px",
            background: "#ffc420",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isInfoOpen ? "FECHAR" : "ABRIR"} INFORMAÇÕES COMPLEMENTARES
        </button>

        {isInfoOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px", border: "1px solid #eee", borderRadius: "10px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500" }}>
              1. Há quanto tempo a comunidade existe?  
              <input 
                type="text" 
                value={communityAge}
                onChange={(e) => setCommunityAge(e.target.value)}
                placeholder="Ex: 10 anos"
                style={{ width: "100%", padding: "8px", marginTop: "6px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px" }} 
              />
            </label>
          </div>
        )}

        {/* --- SECTION 3: GERAR RELATÓRIO --- */}
        <button
          type="button"
          onClick={handleGenerateReport}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            background: "#9ecd45", // Green button to stand out as an action
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          GERAR RELATÓRIO
        </button>

        {reportText && (
          <div style={{
            padding: "16px",
            background: "#f0fdf4",
            border: "1px solid #9ecd45",
            borderRadius: "8px",
            color: "#9ecd45",
            fontSize: "14px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap"
          }}>
            <strong>Relatório Gerado:</strong><br />
            {reportText}
          </div>
        )}

      </div>
    </div>
  );
}
