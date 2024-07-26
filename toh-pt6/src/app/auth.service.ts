import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/auth/login';  
  private registerUrl = 'http://localhost:8080/api/register';  

  private loggedIn = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.checkToken();
   }

   private checkToken(): void {
    if (this.hasToken()) {
      this.loggedIn.next(true);
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }


  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ username, password });

    return this.http.post<any>(this.loginUrl, body, { headers })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('auth_token', response.token);
            this.loggedIn.next(true);
          }
        }),
        catchError(this.handleError<any>('login'))
      );
  }





  logout(): void {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
    // Optionally, inform the server about the logout
  }
  /*

  logout(): void {
    this.http.post<any>(this.loginUrl, {}).subscribe(() => {
      localStorage.removeItem('auth_token');
      this.loggedIn.next(false);
    });
  }
*/


  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.registerUrl, user);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
