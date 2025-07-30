import { Timestamp } from "@angular/fire/firestore";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: Timestamp;
  bio: string;
  techStack: string;
  currentRole: string;
  readingList: string[];
}

export interface UserUpdate {
  bio: string;
  techStack: string;
  currentRole: string;
}
