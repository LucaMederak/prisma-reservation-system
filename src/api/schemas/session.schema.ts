import * as yup from "yup";
import { IUserInput } from "@/interfaces/user.interfaces";

export const createSessionSchema = yup.object().shape({
  body: yup.object<
    Record<keyof Pick<IUserInput, "email" | "password">, yup.AnySchema>
  >({
    email: yup.string().required().email(),
    password: yup.string().required(),
  }),
});
