import { Timestamp } from "firebase/firestore";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: Timestamp;
  bio: string;
  techStack: string;
  currentRole: string;
}
