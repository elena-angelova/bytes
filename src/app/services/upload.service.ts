import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CloudinaryUploadResponse } from "../types";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  private cloudName = "ddmv534o3";
  private uploadPreset = "bytes_thumbnails";

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post<CloudinaryUploadResponse>(url, formData);
  }
}
