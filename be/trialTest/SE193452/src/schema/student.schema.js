import dayjs from "dayjs";
import * as yup from "yup";

export const studentSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .test("min-words", "Name must have more than 2 word", (v) =>
      v ? v.trim().split(/\s+/).length > 2 : false
    ),
  image: yup
    .string()
    .required("Image is required")
    .url("Image must be a valid URL"),
  gender: yup.boolean().required("Gender is required!"),
  dateofbirth: yup
    .date()
    .typeError("Date is invalid")
    .max(dayjs().endOf("day").toDate(), "Date must be past or now")
    .required("Date is required"),
  feedback: yup.string().optional(),
  class: yup.string().required("Class is required!"),
});

export default studentSchema;
