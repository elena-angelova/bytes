import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ProfileStatsComponent } from "./profile-stats/profile-stats";
import { ProfileDetailsFormComponent } from "./profile-details-form/profile-details-form";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Timestamp } from "firebase/firestore";
import { ArticleService } from "../../services/article.service";
import { combineLatest, EMPTY, Subscription, switchMap } from "rxjs";
import { LoaderComponent } from "../../shared/loader/loader";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { ErrorService } from "../../services/error.service";
import { customErrorMessages, firebaseErrorMessages } from "../../config";
import { ToastNotificationComponent } from "../../shared/toast-notification/toast-notification";

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
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  currentUserId: string | null = null;
  displayName: string | null = null;
  email: string | null = null;
  bio: string | null = null;
  currentRole: string | null = null;
  techStack: string | null = null;
  dateJoined: Timestamp | null = null;

  articleCount: number | null = null;
  totalLikes: number | null = null;
  favoriteCategory: string | null = null;

  isLoadingPage: boolean = true;
  isSaving: boolean = false;
  isEditing: boolean = false;
  hasError: boolean = false;
  serverErrorMessage: string = "";

  // Build the form
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
        switchMap((currentUser) => {
          if (!currentUser) {
            const errorCode = "unauthenticated";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoadingPage = false;
            return EMPTY;
          }

          // Store current user's info from Firebase Auth
          this.displayName = currentUser.displayName;
          this.email = currentUser.email;
          this.currentUserId = currentUser.uid;

          // Fetch current user's profile and the articles they have written
          return combineLatest([
            this.userService.getUserData(currentUser.uid),
            this.articleService.getOwnArticles(currentUser.uid),
          ]);
        })
      )
      .subscribe({
        next: ([userData, articles]) => {
          // If profile doesn't exist, show an error message
          if (!userData) {
            console.log(this.displayName);
            console.log(this.email);
            console.log(this.dateJoined);
            console.log(this.articleCount);
            console.log(this.favoriteCategory);
            console.log(this.totalLikes);

            console.log(this.bio);
            console.log(this.currentRole);
            console.log(this.techStack);

            const errorCode = "user/not-found";
            this.errorService.handleError(this, errorCode, customErrorMessages);
            this.isLoadingPage = false;
            return;
          }

          // Store profile details for display
          this.dateJoined = userData.dateJoined;
          this.bio = userData.bio;
          this.currentRole = userData.currentRole;
          this.techStack = userData.techStack;

          // If the user isn't currently editing, populate the form with the profile details (to avoid overwriting their changes)
          if (!this.isEditing) {
            this.profileDetailsForm.patchValue({
              bio: userData.bio,
              currentRole: userData.currentRole,
              techStack: userData.techStack,
            });
          }

          // Store number of articles written
          this.articleCount = articles.length;

          // Count articles per category and sum total likes across all articles
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

          // Set the most frequent category as favorite
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

  // Update editing state when child emits a change
  onEditingChange(isEditing: boolean): void {
    this.isEditing = isEditing;
  }

  // Update user's profile with the form values
  onSubmit(): void {
    this.isSaving = true;

    // Filter out any non-string, undefined or null values from the submitted data (so only fields the user has actually touched are sent to Firestore)
    const filteredEntries = Object.entries(
      this.profileDetailsForm.value
    ).filter(
      ([_, value]) =>
        typeof value === "string" && value !== undefined && value !== null
    ) as [string, string][];

    const filteredDataObj: Record<string, string> =
      Object.fromEntries(filteredEntries);

    if (!this.currentUserId) {
      const errorCode = "unauthenticated";
      this.errorService.handleError(this, errorCode, customErrorMessages);
      this.isSaving = false;
      return;
    }

    // Call service to update the profile data
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
