import { FormFields } from "../types";

export const formFields: FormFields = {
  firstName: {
    name: "firstName",
    id: "firstName",
    label: "First name *",
    type: "text",
    placeholder: "First name",
    required: true,
    errorMessages: {
      required: "Please enter your first name.",
      minlength: "First name needs to be at least 2 characters long.",
    },
  },
  lastName: {
    name: "lastName",
    id: "lastName",
    label: "Last name *",
    placeholder: "Last name",
    type: "text",
    required: true,
    errorMessages: {
      required: "Please enter your last name.",
      minlength: "Last name needs to be at least 2 characters long.",
    },
  },
  email: {
    name: "email",
    id: "email",
    label: "Email *",
    placeholder: "Email",
    type: "email",
    required: true,
    errorMessages: {
      required: "Please enter an email address.",
      email: "Please enter a valid email address (e.g., name@example.com).",
    },
  },
  password: {
    name: "password",
    id: "password",
    label: "Password *",
    placeholder: "Password",
    type: "password",
    required: true,
    errorMessages: {
      required: "Please enter a password.",
      minlength: "Password should be at least 8 characters long.",
      pattern:
        "Password must include uppercase and lowercase letters, a number, and a special character (e.g., !, @, #).",
    },
  },
  repeatPassword: {
    name: "repeatPassword",
    id: "repeatPassword",
    label: "Repeat password *",
    placeholder: "Repeat password",
    type: "password",
    required: true,
    errorMessages: {
      required: "Please confirm your password.",
      passwordMismatch: "Passwords don't match.",
    },
  },
  newPassword: {
    name: "newPassword",
    id: "newPassword",
    label: "New password *",
    placeholder: "New password",
    type: "password",
    required: true,
    errorMessages: {
      required: "Please enter a new password.",
      minlength: "New password should be at least 8 characters long.",
      pattern:
        "New password must include uppercase and lowercase letters, a number, and a special character (e.g., !, @, #).",
    },
  },
  repeatNewPassword: {
    name: "repeatNewPassword",
    id: "repeatNewPassword",
    label: "Repeat new password *",
    placeholder: "Repeat new password",
    type: "password",
    required: true,
    errorMessages: {
      required: "Please confirm your new password.",
      passwordMismatch: "Passwords don't match.",
    },
  },
  acceptTerms: {
    name: "acceptTerms",
    id: "acceptTerms",
    label: "I have read and accept the Terms of Use",
    type: "checkbox",
    required: true,
    errorMessages: {
      required: "You need to accept the Terms of Use to continue.",
    },
  },
};
