import * as yup from "yup";
const studentSchema = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  dateofbirth: yup.date().required("Date of birth is required"),
  gender: yup.boolean().required("Gender is required"),
  class: yup.string().required("Class is required"),
  image: yup
    .string()
    .url("Image must be a valid URL")
    .required("Image is required"),
  feedback: yup.string().optional(),
});

export default studentSchema;
