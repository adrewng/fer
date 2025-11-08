import * as yup from "yup";

const artToolSchema = yup.object({
  artName: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    )
    .test("lowercase", "Name must be lowercase", (v) =>
      v ? v === v.toLocaleLowerCase() : false
    ),

  image: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(10, "Min is 10"),
  glassSurface: yup.boolean().required(),
  brand: yup
    .string()
    .oneOf(["KingArt", "Color Spalash", "Edding", "Arteza"], "Invalid brand")
    .required("Brand is required"),
  description: yup.string().required("Description is required"),
  limitedTimeDeal: yup
    .number()
    .typeError("Must be number")
    .min(0)
    .required("Limited Time Deal is required"),
});

export default artToolSchema;
