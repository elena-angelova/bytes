import { Component, inject, OnInit } from "@angular/core";
import { ProfileStatsComponent } from "./profile-stats/profile-stats";
import { ProfileDetailsFormComponent } from "./profile-details-form/profile-details-form";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Timestamp } from "firebase/firestore";
import { ArticleService } from "../../services/article.service";
import { filter, forkJoin, switchMap, take, tap } from "rxjs";
import { User } from "firebase/auth";
import { LoaderComponent } from "../../shared/loader/loader";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SectionTitleComponent } from "../../shared/section-title/section-title";
import { UserUpdate } from "../../types";

@Component({
  selector: "app-profile-settings",
  imports: [
    SectionTitleComponent,
    ProfileStatsComponent,
    ProfileDetailsFormComponent,
    LoaderComponent,
  ],
  templateUrl: "./profile-settings.html",
  styleUrl: "./profile-settings.css",
})
export class ProfileSettingsComponent implements OnInit {
  displayName!: string | null;
  email!: string | null;
  userId!: string;
  dateJoined!: Timestamp;
  currentRole!: string | null;
  bio!: string | null;
  techStack!: string | null;
  articleCount!: number;
  favoriteCategory!: string;
  totalLikes!: number;
  isLoading: boolean = true;
  isEditing: boolean = false;

  //* Consider introducing max character limit
  private formBuilder = inject(FormBuilder);
  profileDetailsForm: FormGroup = this.formBuilder.group({
    bio: [""],
    currentRole: [""],
    techStack: [""],
  });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((currentUser): currentUser is User => !!currentUser),
        tap((currentUser) => {
          this.displayName = currentUser.displayName;
          this.email = currentUser.email;
          this.userId = currentUser.uid;
        }),
        switchMap((currentUser) =>
          forkJoin({
            articles: this.articleService
              .getArticlesByAuthor(currentUser.uid)
              .pipe(take(1)),
            userData: this.userService
              .getUserData(currentUser.uid)
              .pipe(take(1)),
          })
        )
      )
      .subscribe({
        next: ({ articles, userData }) => {
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

          if (userData) {
            this.dateJoined = userData.dateJoined;
            this.bio = userData.bio;
            this.currentRole = userData.currentRole;
            this.techStack = userData.techStack;

            this.profileDetailsForm.patchValue({
              bio: userData.bio,
              currentRole: userData.currentRole,
              techStack: userData.techStack,
            });
          }

          this.isLoading = false;
        },
        error: (err) => console.log(err), //! Add error handling
      });
  }

  //* Update button should be disabled while this is running
  onSubmit(data: UserUpdate): void {
    const filteredData: [string, string][] = Object.entries(data).filter(
      ([key, value]) => value !== undefined && value !== null
    );
    const filteredDataObj: { [key: string]: string } =
      Object.fromEntries(filteredData);

    this.userService.editUserData(filteredDataObj, this.userId).subscribe({
      next: () => {
        if (filteredDataObj["bio"] !== undefined) {
          this.bio = filteredDataObj["bio"];
        }

        if (filteredDataObj["currentRole"] !== undefined) {
          this.currentRole = filteredDataObj["currentRole"];
        }

        if (filteredDataObj["techStack"] !== undefined) {
          this.techStack = filteredDataObj["techStack"];
        }

        this.profileDetailsForm.patchValue(filteredDataObj);

        this.isEditing = false;
      },
      error: (err) => console.log(err), //! Add error handling
    });
  }
}
