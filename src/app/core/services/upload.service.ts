import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Upload } from "../models/upload";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private baseUrl =`${environment.apiUrl}/uploads`;

  private selectedFile: File | null = null;

  constructor(private http: HttpClient) { }
  // Získá uploady podle názvu souboru
  getUploadsByFilename(filename: string): Observable<Upload[]> {
    return this.http.get<Upload[]>(`${this.baseUrl}/search?filename=${filename}`);
  }

  // Získá uploady podle ID uživatele
  getUploadsByUserId(userId: number): Observable<Upload[]> {
    return this.http.get<Upload[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Nastaví vybraný soubor pro upload
  setFile(file: File | null) {
    this.selectedFile = file;
  }

  // Vrátí aktuálně vybraný soubor
  getFile(): File | null {
    return this.selectedFile;
  }

  // Vyčistí vybraný soubor
  clearFile() {
    this.selectedFile = null;
  }

  // Získá uploady spojené s daným příspěvkem
  getUploadsForPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${postId}`);
  }

 

}
