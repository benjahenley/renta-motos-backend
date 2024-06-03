import { StringSchema } from "yup";

declare module "yup" {
  interface StringSchema {
    notInPast(errorMessage: string): this;
  }
}
