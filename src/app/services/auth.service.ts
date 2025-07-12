import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import { doc, setDoc } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    await setDoc(doc(this.firestore, "users", userCredential.user.uid), {
      email,
      firstName,
      lastName,
      dateJoined: new Date(),
    });

    return userCredential;
  }
}
