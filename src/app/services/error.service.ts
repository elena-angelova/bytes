import { Injectable } from "@angular/core";
import { ErrorContext } from "../types";
import { defaultErrorMessage } from "../config";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  handleError(
    context: ErrorContext,
    error: string,
    errorMessagesMap: Record<string, string>
  ) {
    context.serverErrorMessage = errorMessagesMap[error] || defaultErrorMessage;

    if ("hasError" in context) {
      context["hasError"] = true;
      setTimeout(() => (context["hasError"] = false), 4000);
    }
  }
}
