import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { SearchService } from '../search.service';
import { User } from '../user';
import { Post } from '../post';
import { Thread } from '../thread';
import { Upload } from '../upload';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  getFileUrl(uploadId: number): string {
     return `${environment.apiUrl}/uploads/download/${uploadId}`;

   //`http://localhost:8080/api/uploads/download/${uploadId}`;
  }

  results$!: Observable<any[]>;
  private searchTerms = new Subject<string>();
  searchType: 'users' | 'posts' | 'threads' | 'uploads' = 'users';
 

  constructor(private searchService: SearchService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  setSearchType(type: 'users' | 'posts' | 'threads' | 'uploads'): void {
    this.searchType = type;
    this.searchTerms.next(''); // Vymaže aktuální výsledky
    this.search('');
  }

  ngOnInit(): void {
    this.results$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (!term.trim()) {
          return of([]);
        }
        let url = '';
        switch (this.searchType) {
          case 'users':
            //'http://localhost:8080/api/users'
            url = `${environment.apiUrl}/users`; 
            break;
          case 'posts':
            // 'http://localhost:8080/api/posts'
            url = `${environment.apiUrl}/posts`; 
            break;
          case 'threads':
            //'http://localhost:8080/api/threads'
            url = `${environment.apiUrl}/threads`; 
            break;
          case 'uploads':
            //'http://localhost:8080/api/uploads'
            url = `${environment.apiUrl}/uploads`; 
            break;
        }
        return this.searchService.search<any>(url, term);
      })
    );
  }
}
