import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Role } from '../models/user'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl =`${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }
  // Získá seznam všech rolí
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}`);
  }

  // Přidá novou roli
  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}`, role);
  }

  // Smaže roli podle ID
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Získá roli podle ID
  getRole(id: number): Observable<Role> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Role>(url).pipe(
      catchError(this.handleError<Role>(`getRole id=${id}`))
    );
  }

  // Obsluha chyb
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}
