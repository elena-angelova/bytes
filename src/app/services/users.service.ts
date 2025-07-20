import { Injectable } from "@angular/core";
import { doc, docData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { User } from "../types";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private firestore: Firestore) {}

  getUserData(uid: string): Observable<User | undefined> {
    const userDocRef = doc(this.firestore, "users", uid);

    return docData(userDocRef) as Observable<User | undefined>;
  }
}
