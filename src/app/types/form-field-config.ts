export interface FormFieldConfig {
  [attribute: string]: FormAttributes;
}

export interface FormAttributes {
  name: string;
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
}
