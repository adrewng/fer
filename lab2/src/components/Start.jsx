export default function Star({ filled }) {
  return (
    <span
      className={filled ? "text-warning" : "text-muted"}
      style={{ opacity: filled ? 1 : 0.3 }}
    >
      ★
    </span>
  );
}
