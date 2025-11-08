import * as yup from "yup";

export const lessonSchema = yup.object({
  lessonTitle: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    ),

  lessonImage: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),

  estimatedTime: yup
    .number()
    .typeError("Estimated Time  must be a number")
    .required("Estimated Time is required")
    .min(1, "Min is 1"),
  isCompleted: yup.boolean().required(),
  level: yup
    .string()
    .oneOf(["N1", "N2", "N3", "N4", "N5"], "Invalid level")
    .required("Level is required"),
});

export default lessonSchema;
