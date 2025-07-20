export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  acceptTerms: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface CreateFormValues {
  title: string;
  category: string;
  thumbnailUrl: string;
  content: string;
}
