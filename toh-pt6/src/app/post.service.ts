import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient) { }

  getPostsByContent(content: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/search?content=${content}`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/user/${userId}`);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, post);
  }

  getPostsByThreadId(threadId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/thread/${threadId}`);
  }
}
