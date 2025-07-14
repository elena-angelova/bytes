import { FormFieldConfig } from "../types";

export const formFields: FormFieldConfig = {
  firstName: {
    name: "firstName",
    id: "firstName",
    label: "First name *",
    type: "text",
    placeholder: "First name",
  },
  lastName: {
    name: "lastName",
    id: "lastName",
    label: "Last name *",
    placeholder: "Last name",
    type: "text",
  },
  email: {
    name: "email",
    id: "email",
    label: "Email *",
    placeholder: "Email",
    type: "email",
  },
  password: {
    name: "password",
    id: "password",
    label: "Password *",
    placeholder: "Password",
    type: "password",
  },
  repeatPassword: {
    name: "repeatPassword",
    id: "repeatPassword",
    label: "Repeat password *",
    placeholder: "Repeat password",
    type: "password",
  },
  newPassword: {
    name: "newPassword",
    id: "newPassword",
    label: "New password *",
    placeholder: "New password",
    type: "password",
  },
  repeatNewPassword: {
    name: "repeatNewPassword",
    id: "repeatNewPassword",
    label: "Repeat new password *",
    placeholder: "Repeat new password",
    type: "password",
  },
  acceptTerms: {
    name: "acceptTerms",
    id: "acceptTerms",
    label: "I have read and accept the Terms of Use",
    type: "checkbox",
  },
};
