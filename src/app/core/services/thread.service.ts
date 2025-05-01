import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Thread } from "../models/thread";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ThreadService {


private threadCreatedSource = new Subject<void>();
threadCreated$ = this.threadCreatedSource.asObservable();

notifyThreadCreated(): void {
  this.threadCreatedSource.next();
}


  searchThreads(term: string): any {
    throw new Error('Method not implemented.');
  }

  private baseUrl =`${environment.apiUrl}/threads`;

  constructor(private http: HttpClient) { }

    getThreadsByName(name: string): Observable<Thread[]> {
      return this.http.get<Thread[]>(`${this.baseUrl}/search?name=${name}`);
    }

  // Vytvoří nové diskuzní vlákno
  createThread(thread: Thread): Observable<Thread> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Thread>(this.baseUrl, thread, { headers });
  }

  // Získá vlákno podle ID
  getThreadById(id: number): Observable<Thread> {
    return this.http.get<Thread>(`${this.baseUrl}/${id}`);
  }

  // Získá všechna diskuzní vlákna
  getThreads(): Observable<Thread[]> {
    return this.http.get<Thread[]>(this.baseUrl);
  }

  // Smaže vlákno podle ID
  deleteThread(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Alternativní metoda pro získání vlákna (duplicitní s getThreadById)
  getThread(id: number): Observable<Thread> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Thread>(url);
  }

  // Získá všechna vlákna založená konkrétním uživatelem
  getThreadsByIdUser(userId: number): Observable<Thread[]> {
    return this.http.get<Thread[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Získá vlastníka daného vlákna
  getOwnerOfThread(idThread: number): Observable<string> {
    return this.http.get(`${this.baseUrl}/${idThread}/owner`, { responseType: 'text' });
  }


}
