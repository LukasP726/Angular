import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { FriendRequest } from '../models/friend-request';
import { FriendRequestDTO } from '../models/friend-requestDTO';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private apiUrl =`${environment.apiUrl}/friends`;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };


  constructor(private http: HttpClient) { }

  // Ověří, zda jsou uživatelé přátelé
  checkIfFriend(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-friend/${userId}`, this.httpOptions);
  }
    

  // Odeslání žádosti o přátelství
  sendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/request/${userId}`, {}, this.httpOptions).pipe(
        catchError(err => {
            console.error('Error sending friend request', err);
            return throwError(err);
        })
    );
  }

  // Přijetí žádosti o přátelství
  acceptFriendRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept/${requestId}`, {}, this.httpOptions);
  }

  // Získání seznamu všech přátel přihlášeného uživatele.
  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/list`, this.httpOptions); // Endpoint pro získání přátel
  }
  
  // Získání seznamu všech příchozích žádostí o přátelství.
  getFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests`, this.httpOptions); // Endpoint pro získání žádostí
  }


  // Odebrání (zrušení) přátelství s daným uživatelem.
  removeFriend(friendId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${friendId}`,this.httpOptions);
  }

  // Získání příchozích žádostí o přátelství ve formátu DTO (Data Transfer Object).
  getRequestsDTO(): Observable<FriendRequestDTO[]> {
    return this.http.get<FriendRequestDTO[]>(`${this.apiUrl}/requestsDTO`, this.httpOptions); // Endpoint pro získání žádostí
  }
  

  
}
