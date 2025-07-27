export interface FormFields {
  [field: string]: FieldAttributes;
}

export interface FieldAttributes {
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
