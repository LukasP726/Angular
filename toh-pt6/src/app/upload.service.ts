import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Upload } from "./upload";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl = 'http://localhost:8080/api/uploads';

  private selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  getUploadsByFilename(filename: string): Observable<Upload[]> {
    return this.http.get<Upload[]>(`${this.baseUrl}/search?filename=${filename}`);
  }

  getUploadsByUserId(userId: number): Observable<Upload[]> {
    return this.http.get<Upload[]>(`${this.baseUrl}/user/${userId}`);
  }

/*
  uploadFile(file: File, postId: number, userId: number): Observable<Upload> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('postId', postId.toString());
    formData.append('userId', userId.toString());
    return this.http.post<Upload>(this.baseUrl, formData);

    
  }
*/

  setFile(file: File | null) {
    this.selectedFile = file;
  }

  getFile(): File | null {
    return this.selectedFile;
  }

  clearFile() {
    this.selectedFile = null;
  }

  getUploadsForPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${postId}`);
  }

 

}
