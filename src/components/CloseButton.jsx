export default function CloseButton({ onClick, size = 20, color = "#333" }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      style={{
        border: "none",
        background: "transparent",
        fontSize: `${size}px`,
        lineHeight: 1,
        color,
        cursor: "pointer",
        padding: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ×
    </button>
  );
}