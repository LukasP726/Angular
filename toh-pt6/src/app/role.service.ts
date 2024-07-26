import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Role } from './user'; 

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8080/api/roles'; // Změňte URL na odpovídající backend API

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}`);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getRole(id: number): Observable<Role> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Role>(url).pipe(
      catchError(this.handleError<Role>(`getRole id=${id}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
