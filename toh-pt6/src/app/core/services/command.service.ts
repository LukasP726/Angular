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
  //private baseUrl = 'http://localhost:8080/execute'; // URL na backend

  constructor(private http: HttpClient) {}

  executeCommand(command: string): Observable<string> {
    return this.http.get(this.baseUrl, {
      params: { command },
      responseType: 'text'
    });
  }


  readLog(logPath: string): Observable<string> {
    return this.http.get(this.logUrl, {
      params: { logPath },
      responseType: 'text'
    });
  }
}
