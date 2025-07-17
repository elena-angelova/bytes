export interface FormFieldConfig {
  [attribute: string]: FormAttributes;
}

export interface FormAttributes {
  name: string;
  id: string;
  label: string;
  errorMessages: ErrorMessages;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export interface ErrorMessages {
  [validator: string]: string;
}
