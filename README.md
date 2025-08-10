# [bytes]

**[bytes]** is a blogging platform for developers, where users can share and explore stories focused on software development and technology. They can register, create and manage articles with rich text, interact with the articles via likes and bookmarks, and customize their profiles.

## Table of contents

- [How to run](#how-to-run)
- [Technologies & libraries](#technologies--libraries)
- [Features](#features)
- [Application structure](#application-structure)
- [Folder structure](#folder-structure)

---

## How to run

The app is deployed at [bytes-5f133.web.app](https://bytes-5f133.web.app).

To run in development mode:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/elena-angelova/bytes.git
    ```
   ```bash
   cd bytes
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start a local development server**:
   ```bash
   npm start
   ```
    App runs at `http://localhost:4200`

All necessary configuration for Firebase and Cloudinary, including API keys, are already included within the project repository.


### Test user credentials:

**User 1**
- Email: **john@example.com**
- Password: **123Test-**

**User 2**
- Email: **anna@example.com**
- Password: **123Test-**

**User 3**
- Email: **stephen@example.com**
- Password: **123Test-**

---

## Technologies & libraries

- Angular 20.1.1
- Angular Material
- Angular Animations
- Angular Forms
- AngularFire & Firebase (Authentication, Cloud Firestore, Hosting)
- RxJS (used with observables and operators like `switchMap`, `combineLatest`, `forkJoin`, `tap`, `map`)
- Quill (rich text editor)
- DOMPurify (sanitizing HTML content)
- Cloudinary API (for image uploads)
- Vector graphics (HTML5 SVG icons)

---

## Features

- **Authentication**: Full user authentication flow including registration, login, logout, and persistent session management.
- **Article management**: Full CRUD functionality for articles - users can create, edit, delete, and view articles. Supports rich text editing via a WYSIWYG editor.
- **Article interaction**: like/unlike, bookmark, and copy URL.
- **Categories**: Articles are organized by categories, allowing users to browse specific topics.
- **Profile management**: Users can edit personal details and view stats.
- **Author profile**: Each author has a dedicated profile page showcasing their articles, bio, current role, tech stack and join date.
- **Reading list**: Registered users can save articles to a personalized reading list.
- **Modals**: Modal dialogs for login, registration, and delete confirmation.
- **Search**: Allows users to find articles by title or category. Matches terms that begin exactly with the entered query.
- **Pagination**: Article listings implement pagination.
- **Error handling**: Centralized error handling service provides user-friendly messages for validation, Firebase, Cloudinary, and general application errors. Errors are communicated via toast notifications.
- **Dark mode**: Supports theme switching to dark mode.

---

## Application structure

### Backend overview

The backend of the application is powered by Firebase:
- **Cloud Firestore** is used as the primary database to store and manage articles and user profiles.
- **Firebase Authentication** handles user registration, login, logout and session management.

Communication with Firebase is handled via AngularFire, which is a wrapper around Firebase's modular SDK.

The app also integrates Cloudinary via its API for image uploads.

#### Collections

- **articles**: Contains blog articles with rich text content, metadata (author, categories, created at timestamp), likes, and cover image.
- **users**: Stores user profiles - personal information like first and last name, bio, current role, tech stack, join date, and reading list.

### Public part

Accessible without authentication. Guest users can browse articles and author information but cannot interact with articles (like, bookmark). They can only copy the article URL to share.

Includes:
- Home
- About
- Login modal
- Registration modal
- Article catalog
- Article details
- Author profiles
- Category browsing
- Search

### Private part

Available after successful login via Firebase Authentication. Users can create articles, edit/delete their already existing articles, like and bookmark articles by other authors, and customize their profile settings.

Includes:
- View profile
- Reading list
- Settings
- Create article
- Edit article
- Delete article

Users remain logged in after refreshing the page thanks to Firebase session persistence.

### Dynamic pages

- **Articles**: Lists all articles with pagination.
- **Category**: Displays all articles in a specific category with pagination.
- **Article details**: Displays the full article content, metadata, and interaction buttons (like, bookmark, share, edit, delete) shown based on user authentication and permissions.
- **Author profile**: Shows author details - including bio, current role, tech stack, and join date - along with their articles, loaded with pagination.
- **Reading list**: Shows articles the user has saved to read later, loaded with pagination.
- **Settings**: Allows users to view and edit their bio, current role, and tech stack; see their email and join date; and view stats like the number of articles published, total likes received, and the category they write about the most.
- **Article edit**: Fetches and loads the selected article's details into the text editor for editing.
- **Search results**: Fetches and displays articles matching the user's query.

---

## Folder structure

```
src/app/
  ├── pages/          # Main pages (articles, category, article edit, article create, profile settings, etc.)
  ├── features/       # Reusable feature components used within pages (article, header, footer)
  ├── modals/         # Modal dialogs (login, register, delete confirmation)
  ├── shared/         # Shared UI components (buttons, loader, toast, empty state, etc.)
  ├── services/       # Services (auth, article, user, modal, error, upload)
  ├── types/          # TypeScript interfaces/models (2+ interfaces used)
  ├── config/         # Configuration files (error messages, form fields, etc.)
  ├── guards/         # Route guards for auth and ownership protection
```
