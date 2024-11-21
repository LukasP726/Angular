import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${environment.apiUrl}/auth/login`;
  private logoutUrl = `${environment.apiUrl}/auth/logout`;
  private registerUrl = `${environment.apiUrl}/register`;
  private isAdminUrl = `${environment.apiUrl}/users/is-admin`;

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
    //možná to budu moct vyměnit za endpoint status ať nefetchuju celýho uživatele
    this.getCurrentUser().subscribe(user => {
      console.log("User fetched during authentication check: ", user); // Pro ladění
//!!user
      this.loggedIn.next(!!user);
    }, error => {
      //console.error('Error during authentication check:', error);
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
      catchError(error => {
        //console.error('Chyba při přihlašování v authService:', error);
        return throwError(error); // Předání chyby dál
      })
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
   

 
  /**
   * Ověření, zda je přihlášený uživatel administrátor
   */


  isLoggedAsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(this.isAdminUrl, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error checking admin status:', error);
        return of(false); // Při chybě vrátíme false
      })
    );
  }


  /*
  isLoggedAsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(this.isAdminUrl).pipe(
      catchError(error => {
        console.error('Error fetching admin status:', error);
        return of(false); // Pokud dojde k chybě, vrátíme false
      })
    );
  }
        */
  

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
        if (error.status === 401) {
          console.warn('User is not authenticated.');
        } else {
          console.error('Error fetching current user:', error);
        }
        return of(null); // Při chybě vrátíme null
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
