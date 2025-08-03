import { Component, inject, OnInit } from "@angular/core";
import { ProfileStatsComponent } from "./profile-stats/profile-stats";
import { ProfileDetailsFormComponent } from "./profile-details-form/profile-details-form";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Timestamp } from "firebase/firestore";
import { ArticleService } from "../../services/article.service";
import { combineLatest, filter, Subscription, switchMap, tap } from "rxjs";
import { User as FirebaseUser } from "firebase/auth";
import { LoaderComponent } from "../../shared/loader/loader";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { User } from "../../types";
import { ErrorService } from "../../services/error.service";
import { customErrorMessages, firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";
import { getAuth, updateProfile } from "@angular/fire/auth";

@Component({
  selector: "app-profile-settings",
  imports: [
    SectionTitleComponent,
    ProfileStatsComponent,
    ProfileDetailsFormComponent,
    LoaderComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./profile-settings.html",
  styleUrl: "./profile-settings.css",
})
export class ProfileSettingsComponent implements OnInit {
  currentUserId!: string;
  displayName!: string | null;
  email!: string | null;
  bio!: string | null;
  currentRole!: string | null;
  techStack!: string | null;
  dateJoined!: Timestamp;

  articleCount!: number;
  totalLikes!: number;
  favoriteCategory!: string;

  isLoadingPage: boolean = true;
  isSaving: boolean = false;
  isEditing: boolean = false;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  private formBuilder = inject(FormBuilder);
  profileDetailsForm: FormGroup = this.formBuilder.group({
    bio: [""],
    currentRole: [""],
    techStack: [""],
  });

  private currentUserSub?: Subscription;
  private userSub?: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private articleService: ArticleService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.currentUserSub = this.authService.currentUser$
      .pipe(
        filter((currentUser): currentUser is FirebaseUser => !!currentUser),
        tap((currentUser) => {
          this.displayName = currentUser.displayName;
          this.email = currentUser.email;
          this.currentUserId = currentUser.uid;
        }),
        switchMap((currentUser) =>
          combineLatest([
            this.userService.getUserData(currentUser.uid),
            this.articleService.getArticlesByAuthor(currentUser.uid),
          ])
        )
      )
      .subscribe({
        next: ([userData, articles]) => {
          if (!userData) {
            const errorCode = "user/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoadingPage = false;
            return;
          }

          this.dateJoined = userData.dateJoined;
          this.bio = userData.bio;
          this.currentRole = userData.currentRole;
          this.techStack = userData.techStack;

          if (!this.isEditing) {
            this.profileDetailsForm.patchValue({
              bio: userData.bio,
              currentRole: userData.currentRole,
              techStack: userData.techStack,
            });
          }

          this.articleCount = articles.length;
          const categoryCount: { [category: string]: number } = {};
          this.totalLikes = 0;

          for (const article of articles) {
            this.totalLikes += article.likes;

            categoryCount[article.category] =
              (categoryCount[article.category] || 0) + 1;
          }

          const sortedCategories = Object.entries(categoryCount).sort(
            (a, b) => b[1] - a[1]
          );

          this.favoriteCategory = sortedCategories[0]?.[0];
          this.isLoadingPage = false;
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isLoadingPage = false;
        },
      });
  }

  onEditingChange(isEditing: boolean) {
    this.isEditing = isEditing;
  }

  onSubmit(data: Partial<User>): void {
    this.isSaving = true;

    const filteredEntries = Object.entries(data).filter(
      ([_, value]) =>
        typeof value === "string" && value !== undefined && value !== null
    ) as [string, string][];

    const filteredDataObj: Record<string, string> =
      Object.fromEntries(filteredEntries);

    this.userSub = this.userService
      .editUserData(filteredDataObj, this.currentUserId)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.isEditing = false;
        },
        error: (error: any) => {
          this.errorService.handleError(
            this,
            error.code,
            firebaseErrorMessages
          );

          this.isSaving = false;
        },
      });
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }
}
