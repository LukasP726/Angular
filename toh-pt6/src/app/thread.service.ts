import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Thread } from "./thread";

@Injectable({
  providedIn: 'root'
})
export class ThreadService {




  searchThreads(term: string): any {
    throw new Error('Method not implemented.');
  }


  private baseUrl = 'http://localhost:8080/api/threads';

  constructor(private http: HttpClient) { }

  getThreadsByName(name: string): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/search?name=${name}`);
  }

  createThread(thread: Thread): Observable<Thread> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Thread>(this.baseUrl, thread, { headers });
  }
  
  getThreadById(id: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.baseUrl}/${id}`);
  }

  getThreads(): Observable<Thread[]> {
    return this.http.get<Thread[]>(this.baseUrl);
  }

  deleteThread(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getThread(id: number): Observable<Thread> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Thread>(url);
  }

  getThreadsByIdUser(userId: number): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/user/${userId}`);
  }

}
