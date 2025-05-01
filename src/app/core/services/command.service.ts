import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  private baseUrl =`${environment.apiUrl}/execute`;
  private logUrl =`${environment.apiUrl}/logs`;

  constructor(private http: HttpClient) {}


  // Načte obsah logovacího souboru ze serveru.
  readLog(logPath: string): Observable<string> {
    return this.http.get(this.logUrl, {
      params: { logPath },
      responseType: 'text'
    });
  }
}
