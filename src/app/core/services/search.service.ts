import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  // Vyhledá záznamy podle zadaného výrazu
  search<T>(url: string, term: string): Observable<T[]> {
    if (!term.trim()) {
      return of([]); // Pokud je term prázdný, vrátí prázdné pole
    }
    return this.http.get<T[]>(`${url}/?name=${term}`).pipe(
      tap(x => x.length ?
        console.log(`found results matching "${term}"`) :
        console.log(`no results matching "${term}"`)
      ),
      catchError(this.handleError<T[]>('search', []))
    );
  }

  // Obsluha chyb
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log do konzole
      return of(result as T);
    };
  }

}
