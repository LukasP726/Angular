import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = `${environment.apiUrl}/users`;
  private roleUrl = `${environment.apiUrl}/roles`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient, private messageService: MessageService, private authService: AuthService) {}

  // Získání všech uživatelů
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl,this.httpOptions).pipe(
      catchError(this.handleError<User[]>('getUsers', []))
    );
  }

  // Získání uživatele podle ID
  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>('getUser'))
    );
  }

  // Přidání nového uživatele
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<User>('addUser'))
    );
  }

  // Aktualizace uživatele
  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.usersUrl}/${user.id}`, user, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateUser'))
    );
  }

  // Smazání uživatele
  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, this.httpOptions).pipe(
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  // Vyhledávání uživatelů podle jména
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found users matching "${term}"`) :
        this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  // Logování zpráv přes MessageService
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }

  // Obsluha chyb
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

getCurrentUser(): Observable<User | null> {
  return this.authService.getCurrentUser();
}

  // Získání uživatele podle jména uživatele
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/username/${username}`).pipe(
      catchError(this.handleError<User>('getUserByUsername'))
    );
  }

  // Získání top uživatelů
  getTopUsers(): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/top-users`).pipe(
      catchError(this.handleError<any>('getTopUsers'))
    );
  }

  // Verifikace aktuálního hesla
  verifyCurrentPassword(currentPassword: string): Observable<boolean> {
    const url = `${this.usersUrl}/verify-password`;
    return this.http.post<boolean>(url, { password: currentPassword }, this.httpOptions).pipe(
      catchError(this.handleError<boolean>('verifyCurrentPassword', false))
    );
  }

  // Aktualizace hesla
  updatePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    const url = `${this.usersUrl}/change-password`;
    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    };
    return this.http.post<any>(url, body,this.httpOptions).pipe(
      catchError(this.handleError<any>('updatePassword'))
    );
  }

  // Přihlášení uživatele (session-based autentizace)
  login(username: string, password: string): Observable<any> {
    const loginUrl = `${environment.apiUrl}/auth/login`;
    return this.http.post(loginUrl, { username, password }, this.httpOptions ).pipe(
      catchError(this.handleError<any>('login'))
    );
  }

  // Odhlášení uživatele (invalidace session)
  logout(): Observable<any> {
    const logoutUrl = `${environment.apiUrl}/auth/logout`;
    return this.http.post(logoutUrl, {},this.httpOptions).pipe(
      catchError(this.handleError<any>('logout'))
    );
  }

  getRoleWeightById(idRole: number): Observable<number> {
    return this.http.get<number>(`${this.roleUrl}/weight/${idRole}`);
  }
}
