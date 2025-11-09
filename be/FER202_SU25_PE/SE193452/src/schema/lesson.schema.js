import * as yup from "yup";
const lessonSchema = yup.object({
  lessonTitle: yup
    .string()
    .required("Lession title is required!")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    ),
  lessonImage: yup
    .string()
    .url("image must be url!")
    .required("image is required"),
  isCompleted: yup.boolean().typeError().required("IsCompleted is required!"),
  estimatedTime: yup
    .number()
    .typeError("Time must be number!")
    .required("Time is required!")
    .min(1, "Time must large than 1"),
  level: yup
    .string()
    .oneOf(["N1", "N2", "N3", "N4", "N5"], "Invalid level")
    .required("Level is required"),
});

export default lessonSchema;
