import { Injectable } from "@angular/core";
import {
  Auth,
  authState,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "@angular/fire/auth";
import { doc, Firestore, setDoc, Timestamp } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    authState(this.auth).subscribe((user) => {
      this.currentUser.next(user);
    });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    await setPersistence(this.auth, browserLocalPersistence);

    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    // *Consider moving this to UserService and injecting it here in order to call it
    await setDoc(doc(this.firestore, "users", userCredential.user.uid), {
      email, //! You shouldn't record the email in this collection as it can be read by anyone. For the user profile page, you can get it from Firebase Auth.
      firstName,
      lastName,
      dateJoined: Timestamp.now(),
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  isLoggedIn() {
    return this.currentUser.asObservable();
  }

  getUser() {
    return this.currentUser.value;
  }
}
