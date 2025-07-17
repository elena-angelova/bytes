import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
} from "@angular/fire/auth";
import { Firestore } from "@angular/fire/firestore";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
    });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<UserCredential> {
    await setPersistence(this.auth, browserLocalPersistence);

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

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  isLoggedIn() {
    return this.currentUser.asObservable();
  }

  getUser() {
    return this.currentUser.value;
  }
}
