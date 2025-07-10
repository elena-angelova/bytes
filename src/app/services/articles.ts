import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FirestoreResponse } from "../types";

@Injectable({
  providedIn: "root",
})
export class ArticlesService {
  private apiUrl = environment.articlesEndpoint;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<FirestoreResponse> {
    return this.http.get<FirestoreResponse>(this.apiUrl);
  }
}
