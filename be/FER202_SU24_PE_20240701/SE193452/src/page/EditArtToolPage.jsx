import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import artToolsApi from "../api/artTools.api";
import artToolSchema from "../schema/artToolSchema";

export default function EditArtToolPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(artToolSchema),
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const res = await artToolsApi.getItemDetail(id);
        setItem(res.data);
        reset({
          artName: res.data.artName || "",
          price: Number(res.data.price ?? 0),
          description: res.data.description || "",
          glassSurface: Boolean(res.data.glassSurface),
          image: res.data.image || "",
          brand: res.data.brand || "",
          limitedTimeDeal: Number(res.data.limitedTimeDeal ?? 0),
        });
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await artToolsApi.updateItem(id, data);
      navigate(`/TruongNNSE193452`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  });

  if (isLoading) return <div className="container py-4">Đang tải...</div>;
  if (error && !item)
    return <div className="container py-4 alert alert-danger">{error}</div>;
  if (!item) return <div className="container py-4">Không tìm thấy</div>;

  return (
    <div className="container py-4">
      <h4 className="mb-4">Update Art Tool</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-12 col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên"
            {...register("artName")}
          />
          {errors.artName && (
            <div className="form-text text-danger">
              {errors.artName.message}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Image</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            {...register("image")}
          />
          {errors.image && (
            <div className="form-text text-danger">{errors.image.message}</div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label">Brand</label>
          <select className="form-select" {...register("brand")}>
            <option value="KingArt">KingArt</option>
            <option value="Color Spalash">Color Spalash</option>
            <option value="Edding">Edding</option>
            <option value="Arteza">Arteza</option>
          </select>
          {errors.brand && (
            <div className="form-text text-danger">{errors.brand.message}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            {...register("price")}
          />
          {errors.price && (
            <div className="form-text text-danger">{errors.price.message}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Limited Time Deal</label>
          <input
            type="number"
            className="form-control"
            step="any"
            {...register("limitedTimeDeal")}
          />
          {errors.limitedTimeDeal && (
            <div className="form-text text-danger">
              {errors.limitedTimeDeal.message}
            </div>
          )}
        </div>
        <div className="col-12">
          <label className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Mô tả..."
            {...register("description")}
          ></textarea>
          {errors.description && (
            <div className="form-text text-danger">
              {errors.description.message}
            </div>
          )}
        </div>

        <div className=" col-12 col-md-6 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckChecked"
            {...register("glassSurface")}
          />
          <label className="form-check-label" htmlFor="switchCheckChecked">
            Glass Surface
          </label>
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
