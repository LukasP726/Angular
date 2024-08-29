import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post";
import { catchError, Observable, of, tap } from "rxjs";
import { environment } from "./environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl =`${environment.apiUrl}/posts`;
  //private baseUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  getPostsByContent(content: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/search?content=${content}`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/user/${userId}`);
  }


  getPosts(page: number, itemsPerPage: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}?page=${page}&limit=${itemsPerPage}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  getPostsByThreadId(threadId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/thread/${threadId}`);
  }



    /** GET post by id. Will 404 if id not found */
    getPostById(id: number): Observable<Post> {
      const url = `${this.baseUrl}/${id}`;
      return this.http.get<Post>(url).pipe(
        tap(_ => this.log(`fetched post id=${id}`)),
        catchError(this.handleError<Post>(`getPostById id=${id}`))
      );
    }
  
    private log(message: string): void {
      console.log(`PostService: ${message}`);
    }
  
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        console.error(error);
        this.log(`${operation} failed: ${error.message}`);
        return of(result as T);
      };
    }
}
