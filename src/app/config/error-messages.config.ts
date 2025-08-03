export const defaultErrorMessage: string =
  "Yikes — something went wrong. Try again in a bit.";

export const firebaseErrorMessages: Record<string, string> = {
  internal: "Yikes — something went wrong. Try again in a bit.",
  "permission-denied":
    "You don't have permission to do that. Make sure you're signed in with the right account.",
  "deadline-exceeded":
    "That took too long. Check your connection and give it another shot.",
  unavailable:
    "Service is taking a quick break. Check your connection or try again later.",
  unauthenticated:
    "Hold up — you need to be signed in to do that. Log in and let's get you back on track!",
  "auth/email-already-in-use":
    "An account with this email already exists. Try logging in instead.",
  "auth/invalid-credential":
    "Your login information is incorrect. Please try again.",
  "auth/internal-error": "Yikes — something went wrong. Try again in a bit.",
  "auth/network-request-failed":
    "Looks like you're offline. Check your connection and give it another shot.",
};

export const cloudinaryErrorMessages: Record<string, string> = {
  "Bad Request":
    "Whoops! The image failed to upload. Make sure it's under 10MB and give it another go.",
  "Unknown Error":
    "Whoops! The image failed to upload. Check your connection or try again in a bit.",
};

export const domErrorMessages: Record<string, string> = {
  NotAllowedError:
    "Looks like clipboard access was blocked. Some browsers require extra permissions—try again or check your browser settings.",
  NotFoundError: "Unable to access the clipboard. Please try again.",
  SecurityError:
    "Clipboard access is blocked due to security settings. Please use a secure connection and try again.",
};

export const customErrorMessages: Record<string, string> = {
  unauthenticated:
    "Hold up — you need to be signed in to do that. Log in and let's get you back on track!",
  unauthorized:
    "You don't have permission to do that. Make sure you're signed in with the right account.",
  "article/not-found": "Looks like the article is missing or has been removed.",
  "user/not-found":
    "Looks like this user doesn't exist or their profile has been removed.",
  "current-user/not-found":
    "Your profile seems a bit shy — we couldn't load your data. Try again later.",
};
