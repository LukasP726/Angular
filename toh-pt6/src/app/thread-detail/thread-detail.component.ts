import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../thread';
import { Post } from '../post';
import { PostService } from '../post.service';
import { UploadService } from '../upload.service';
import { catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
[x: string]: any;

  

  thread: Thread | undefined;
  posts: Post[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;
  selectedFile: File | null = null;
 


  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private postService: PostService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentThreadId = +params['id'];
      this.loadThread();
      this.loadPosts();
    });
  }

  loadThread(): void {
    if (this.currentThreadId !== undefined) {
      this.threadService.getThreadById(this.currentThreadId).subscribe(
        (thread: Thread) => this.thread = thread, 
        (error: any) => console.error('Error loading thread:', error)
      );
    }
  }

  loadPosts(): void {
    if (this.currentThreadId !== undefined) {
      this.postService.getPostsByThreadId(this.currentThreadId).subscribe(
        (posts: Post[]) => this.posts = posts, 
        (error: any) => console.error('Error loading posts:', error)
      );
    }
  }

  addPost(): void {
    if (this.newPostContent.trim()) {
      const newPost: Post = {
        content: this.newPostContent,
        idUser: 1, // Zde by mělo být ID přihlášeného uživatele
        idThread: this.currentThreadId!,
        createdAt: new Date()
      };

      this.postService.createPost(newPost).subscribe(
        (post: Post) => {
          this.posts.push(post);
          this.newPostContent = '';
        },
        (error: any) => console.error('Error creating post:', error)
      );
    }
  }




  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }
  

  onUpload() {
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post('http://localhost:8080/api/uploads', uploadData, { responseType: 'text' })
      .pipe(
        tap(response => {
          // Zpracování odpovědi
          console.log('Upload successful:', response);
        }),
        catchError(error => {
          // Zpracování chyby
          console.error('Upload error:', error);
          return of(''); // Vrátí prázdný řetězec nebo jinou hodnotu, která bude vhodná pro použití
        })
      )
      .subscribe(); // Je stále platné, ale pouze pro spouštění Observable
    }



}
