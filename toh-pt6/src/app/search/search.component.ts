import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { SearchService } from '../search.service';
import { User } from '../user';
import { Post } from '../post';
import { Thread } from '../thread';
import { Upload } from '../upload';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
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
            url = 'http://localhost:8080/api/users'; // Upravte na správné URL pro uživatele
            break;
          case 'posts':
            url = 'http://localhost:8080/api/posts'; // Upravte na správné URL pro posty
            break;
          case 'threads':
            url = 'http://localhost:8080/api/threads'; // Upravte na správné URL pro vlákna
            break;
          case 'uploads':
            url = 'http://localhost:8080/api/uploads'; // Upravte na správné URL pro uploady
            break;
        }
        return this.searchService.search<any>(url, term);
      })
    );
  }
}
