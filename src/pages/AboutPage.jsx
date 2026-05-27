export default function AboutPage({
  onClose,
}) {
  return (
    <>
      {/* BACKDROP */}

      <div
        onClick={onClose}
        style={{
          position: "fixed",

          inset: 0,

          background:
            "rgba(0,0,0,0.4)",

          zIndex: 100,
        }}
      />

      {/* MODAL */}

      <div
        style={{
          position: "fixed",

          top: "50%",
          left: "50%",

          transform:
            "translate(-50%, -50%)",

          width: "600px",

          maxWidth: "90vw",

          background: "white",

          borderRadius: "18px",

          padding: "28px",

          zIndex: 101,

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#222",
            }}
          >
            Observatório das Comunidades
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",

              background: "none",

              fontSize: "20px",

              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}

        <p
          style={{
            lineHeight: 1.7,
            color: "#444",
          }}
        >
          O Observatório das Comunidades é um espaço institucional 
          da Defensoria Pública do Estado de São Paulo dedicado ao 
          acolhimento, análise e encaminhamento de demandas coletivas 
          provenientes de comunidades urbanas da capital.
        </p>
      </div>
    </>
  );
}