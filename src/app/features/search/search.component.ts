import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  getFileUrl(uploadId: number): string {
     return `${environment.apiUrl}/uploads/download/${uploadId}`;
  }

  results$!: Observable<any[]>;
  private searchTerms = new Subject<string>();
  searchType: 'users' | 'posts' | 'threads' | 'uploads' = 'users';
 

  constructor(private searchService: SearchService) {}

  // Spuštění hledání s novým termínem
  search(term: string): void {
    this.searchTerms.next(term);
  }

  // Nastavení typu hledání (users, posts, threads nebo uploads)
  setSearchType(type: 'users' | 'posts' | 'threads' | 'uploads'): void {
    this.searchType = type;
    this.searchTerms.next(''); // Vymaže aktuální výsledky
    this.search('');
  }
   

 
  
  

  ngOnInit(): void {
    // Vytváří observable 'results$', které se mění při každé změně v 'searchTerms'
    this.results$ = this.searchTerms.pipe(
      // 'debounceTime' čeká 300 ms po poslední změně, než provede další akci (prevence příliš častých požadavků)
      debounceTime(300),
      // 'distinctUntilChanged' zajistí, že se budou zpracovávat pouze unikátní změny v termínu
      distinctUntilChanged(),
      // 'switchMap' přepíná na nový observable při každé změně termínu
      switchMap((term: string) => {
        
        // Pokud je termín prázdný, vrátí prázdný seznam
        if (!term.trim()) {
          return of([]);
        }
          
        // Inicializuje URL pro API na základě typu hledání
        let url = '';
        switch (this.searchType) {
          case 'users':
            url = `${environment.apiUrl}/users`; 
            break;
          case 'posts':
            url = `${environment.apiUrl}/posts`; 
            break;
          case 'threads':
            url = `${environment.apiUrl}/threads`; 
            break;
          case 'uploads':
            url = `${environment.apiUrl}/uploads`; 
            break;
        }
        
        // Volá searchService pro hledání dle URL a termínu
        return this.searchService.search<any>(url, term);
      })
    );
  }
}
