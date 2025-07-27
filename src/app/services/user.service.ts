import { Injectable } from "@angular/core";
import { doc, docData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../types";
import { setDoc, Timestamp } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private firestore: Firestore) {}

  getUserData(uid: string): Observable<User | undefined> {
    const userDocRef = doc(this.firestore, "users", uid);

    return docData(userDocRef) as Observable<User | undefined>;
  }

  createUserData(
    uid: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const userDocRef = doc(this.firestore, "users", uid);
    return setDoc(userDocRef, {
      firstName,
      lastName,
      dateJoined: Timestamp.now(),
    });
  }
}
