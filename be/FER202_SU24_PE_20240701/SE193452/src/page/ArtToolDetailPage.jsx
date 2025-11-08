import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import artToolsApi from "../api/artTools.api";

function formatLimitedTimeDeal(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return null;
  const pct = n <= 1 ? Math.round(n * 100) : Math.round(n);
  return `${pct}%`;
}
export default function ArtToolDetailPage() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItem = async () => {
    try {
      setIsLoading(true);
      setError("");
      const res = await artToolsApi.getItemDetail(id);
      setItem(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  if (isLoading) return <div className="container py-4">Đang tải...</div>;
  if (error)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Không tìm thấy</div>;
  const pct = formatLimitedTimeDeal(item.limitedTimeDeal);
  return (
    <>
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-md-4 mb-3 text-center position-relative">
            <img
              src={item.image}
              alt={item.artName}
              className="img-fluid rounded-3 shadow-sm object-fit-cover"
              style={{ height: "18rem" }}
            />
            {item.glassSurface && (
              <span
                style={{
                  position: "absolute",
                  top: ".75rem",
                  left: "6rem",
                  transform: "rotate(320deg)",
                  backgroundColor: "var(--bs-danger)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: ".75rem",
                  padding: ".25rem 2.25rem",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
                className="ribbon-corner"
              >
                Glass Surface
              </span>
            )}
          </div>
          <div className="col-12 col-md-8">
            <h2>{item.artName}</h2>
            <div className="mb-3">
              <strong>Brand:</strong> {item.brand}
            </div>
            <div className="mb-3">
              <strong>Price:</strong> {item.price}
            </div>

            <div className="mb-3">
              <strong>Description:</strong> {item.description}
            </div>
            {pct !== null && (
              <div className="mb-3">
                <strong>Limited Time Deal:</strong> {pct}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
