import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  search<T>(url: string, term: string): Observable<T[]> {
    if (!term.trim()) {
      // Pokud není vyhledávací termín, vrátí prázdné pole.
      return of([]);
    }
    return this.http.get<T[]>(`${url}/?name=${term}`).pipe(
      tap(x => x.length ?
         console.log(`found results matching "${term}"`) :
         console.log(`no results matching "${term}"`)),
      catchError(this.handleError<T[]>('search', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
