import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${environment.apiUrl}/auth/login`;
  private statusUrl = `${environment.apiUrl}/auth/status`;
  private logoutUrl = `${environment.apiUrl}/auth/logout`;
  private registerUrl = `${environment.apiUrl}/register`;

  private loggedIn = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) {
    this.checkAuthentication();
  }

  /**
   * Metoda pro kontrolu autentizace při načtení aplikace
   * Ověří, zda je uživatel přihlášen na základě session cookie
   */
  checkAuthentication(): void {
    this.getCurrentUser().subscribe(user => {
      console.log("User fetched during authentication check: ", user); // Pro ladění
//!!user
      this.loggedIn.next(!!user);
    }, error => {
      console.error('Error during authentication check:', error);
      this.loggedIn.next(false);
    });
  }
  

  /**
   * Přihlášení uživatele (session-based autentizace)
   */
  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post<any>(this.loginUrl, body, this.httpOptions).pipe(
      tap(() => {
        this.loggedIn.next(true);
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  /**
   * Odhlášení uživatele
   * Informuje server o odhlášení a nastaví stav uživatele na nepřihlášený
   */
  
  logout(): void {
    this.http.post(this.logoutUrl, {}, this.httpOptions).subscribe(() => {
      this.loggedIn.next(false);
      window.location.href = "/login"; // Přesměrování na login stránku
    }, error => {
      console.error('Error during logout:', error);
    });
  }

  /**
   * Ověření, zda je uživatel přihlášen
   */
 
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
   
    /*
  isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>(this.statusUrl);
  }
 */
  /**
   * Ověření, zda je přihlášený uživatel administrátor
   */
  isLoggedAsAdmin(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => user ? user.idRole === 1 : false), // Upravit '1' na ID, které odpovídá adminovi
      catchError(error => {
        console.error('Error fetching user info:', error);
        return of(false); // Pokud dojde k chybě, vrátíme false
      })
    );
  }
  

  /**
   * Registrace nového uživatele
   */
  register(user: User): Observable<User> {
    return this.http.post<User>(this.registerUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<User>('register'))
    );
  }

  /**
   * Získání aktuálně přihlášeného uživatele
   */
    getCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching current user:', error);
        return of(null);
      })
    );
  }

  /**
   * Obsluha chyb
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
