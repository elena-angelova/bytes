const firestoreBaseUrl = "https://firestore.googleapis.com/v1";
const projectId = "bytes-5f133";
const projectPath = `/projects/${projectId}/databases/(default)/documents`;

const authBaseUrl = "https://identitytoolkit.googleapis.com/v1";
const apiKey = "AIzaSyCMmv9USLjed06iexypPukoZvqEHbKIJP0";

export const environment = {
  articlesEndpoint: `${firestoreBaseUrl}${projectPath}/articles`,
  usersEndpoint: `${firestoreBaseUrl}${projectPath}/users`,
  registerEndpoint: `${authBaseUrl}/accounts:signUp?key=${apiKey}`,
  loginEndpoint: `${authBaseUrl}/accounts:signInWithPassword?key=${apiKey}`,
};
