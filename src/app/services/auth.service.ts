import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  User,
} from "@angular/fire/auth";
import { Observable } from "rxjs";
import { UsersService } from "./users.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly currentUser$!: Observable<User | null>;

  constructor(private auth: Auth, private usersService: UsersService) {
    this.currentUser$ = user(this.auth);
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const displayName = `${firstName} ${lastName}`;

    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: displayName });
    }

    await this.usersService.createUserData(
      userCredential.user.uid,
      firstName,
      lastName
    );
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  //! I need to refactor this method as at refresh it doesn't return the user object, but just null. Might need to subscribe to the user observable like in the NavMenuComponent
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
