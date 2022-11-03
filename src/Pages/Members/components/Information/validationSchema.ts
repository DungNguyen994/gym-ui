import dayjs from "dayjs";
import * as yup from "yup";
import { DATE_FORMAT, VALID_PHONE_REGEX } from "../../../../constants";

export const validationSchema = yup
  .object({
    firstName: yup.string().required("Enter First Name"),
    lastName: yup.string().required("Enter Last Name"),
    email: yup.string().email("Email must be a valid Email"),
    phoneNumber: yup
      .string()
      .required("Enter phone number")
      .matches(VALID_PHONE_REGEX, "Phone number is not valid"),
    birthDate: yup
      .date()
      .transform((value, originalValue, context) => {
        // check to see if the previous transform already parsed the date
        if (context.isType(value)) return value;
        // Date parsing failed in previous transform
        // Parse the date as a euro formatted date string or returns Invalid Date
        return dayjs(originalValue, DATE_FORMAT).toDate();
      })
      .nullable()
      .typeError("Enter a valid date")
      .max(new Date(), "Birth Date can not be a future date"),
  })
  .required();
