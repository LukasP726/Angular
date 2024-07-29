import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Thread } from "./thread";

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private baseUrl = 'http://localhost:8080/api/threads';

  constructor(private http: HttpClient) { }

  getThreadsByName(name: string): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/search?name=${name}`);
  }

  createThread(thread: Thread): Observable<Thread> {
    return this.http.post<Thread>(this.baseUrl, thread);
  }
}
