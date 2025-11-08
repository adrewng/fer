import * as yup from "yup";
export const bookSchema = yup.object({
  bookName: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 1 word", (v) =>
      v ? v.trim().split(/\s+/).length > 1 : false
    )
    .test("uppercase", "Name must be uppercase", (v) =>
      v ? v === v.toUpperCase() : false
    ),
  bookImage: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),
  bookReadingStatus: yup
    .number()
    .typeError("status must be a number")
    .required("status is required")
    .min(1, "Min is 1")
    .max(3, "Max is 3"),
  isUnread: yup
    .boolean()
    .required()
    .when("bookReadingStatus", {
      is: (s) => Number(s) === 2 || Number(s) === 3,
      then: (schema) =>
        schema.oneOf([false], "isUnread must be FALSE when status is 2 or 3"),
      otherwise: (schema) =>
        schema.oneOf([true], "isUnread must be TRUE when status is 1"),
    }),
  bookType: yup
    .string()
    .oneOf(["Data Science", "Security", "Design"], "Invalid type")
    .required("Type is required"),
});

export default bookSchema;
