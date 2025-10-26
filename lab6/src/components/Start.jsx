export default function Star({ filled }) {
  return <span className={filled ? "text-warning" : "text-muted"}>★</span>;
}
