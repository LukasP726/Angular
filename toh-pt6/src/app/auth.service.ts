import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

   checkAuthentication() {
    const token = localStorage.getItem('auth_token'); // Předpokládejme, že token je uložen v localStorage

    if (!token) {
        // Není přihlášený, přesměrujte na přihlašovací stránku
        window.location.href = '/login';
    }
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
    window.location.href="/login"
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

  isLoggedAsAdmin(): Observable<boolean> {
    const token = localStorage.getItem('auth_token'); // Získání tokenu z localStorage

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>('http://localhost:8080/api/users/me', { headers }).pipe(
      map(user => {
        return user.idRole.some((role: any) => role.name === 'Admin');
      }),
      catchError(error => {
        console.error('Error fetching user info:', error);
        return of(false); // Pokud dojde k chybě, vrátíme false
      })
    );
  }

/*
  isLoggedAsAdmin(): Observable<boolean> {
    return this.http.get<any>('/api/users/me').pipe(
      map(user => {
        return user.roles.some((role: any) => role.name === 'Admin');
      }),
      catchError(error => {
        console.error('Error fetching user info:', error);
        return of(false); // Pokud dojde k chybě, vrátíme false
      })
    );
  }
    */
  /*

  isAdmin(): boolean {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken && decodedToken.role === 'ADMIN';
    }
    return false;
  }
*/
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
