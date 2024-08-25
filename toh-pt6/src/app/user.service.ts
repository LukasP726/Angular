import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from './user';
import { environment } from './environments/environment';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = `${environment.apiUrl}/users`;
  //private usersUrl = 'http://localhost:8080/api/users';
  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,
    private messageService: MessageService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl);
  }

  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url);
  }



  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions).pipe(
      catchError(this.handleError<User>('addUser'))
    );
    
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.usersUrl}/${user.id}`, user, this.httpOptions);
  }

  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, this.httpOptions);
  }  

  searchUsers(term: string):Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found users matching "${term}"`) :
         this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      this.messageService.add(`UserService: ${message}`);
    }

     /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
/*
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/me`);
  }
*/
getCurrentUser(): Observable<User | null> {
  const token = localStorage.getItem('auth_token');
  
  // Pokud není token přítomen, vrátí prázdného uživatele
  if (!token) {
    return of(null);
  }

  // Příprava hlaviček pro API požadavek
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // Volání API a zpracování chyby
  return this.http.get<User>(`${this.usersUrl}/me`, { headers }).pipe(
    map(user => user),
    catchError(error => {
      console.error('Error fetching current user:', error);
      // Vrátí prázdného uživatele v případě chyby
      return of(null);
    })
  );
}

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/username/${username}`);
  }

  
  getTopUsers(): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/top-users`);
  }





  verifyCurrentPassword(currentPassword: string): Observable<boolean> {
    const url = `${this.usersUrl}/verify-password`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<boolean>(url, { password: currentPassword }, { headers }).pipe(
      catchError(this.handleError<boolean>('verifyCurrentPassword', false))
    );
  }

/*

  updatePassword(newPassword: string): Observable<any> {
    const url = `${this.usersUrl}/change-password`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<any>(url, { password: newPassword }, { headers }).pipe(
      catchError(this.handleError<any>('updatePassword'))
    );
  }
  */

  updatePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    const url = `${this.usersUrl}/change-password`;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword
    };
  
    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(this.handleError<any>('updatePassword'))
    );
  }
  
  
}
