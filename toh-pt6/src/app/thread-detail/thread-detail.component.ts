import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../thread';
import { Post } from '../post';
import { PostService } from '../post.service';
import { UploadService } from '../upload.service';
import { catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Upload } from '../upload';


@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
[x: string]: any;

  
  uploads: Upload[] = [];
  postId: number = 1;
  thread: Thread | undefined;
  posts: Post[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;
  selectedFile: File | null = null;
  currentUserId: number = 1;
  newPostId: number | undefined;
 


  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private postService: PostService,
    private http: HttpClient,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentThreadId = +params['id'];
      this.loadThread();
      this.loadPosts();
      this.loadUploads();
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
        createdAt: new Date(),
        idUpload: null // Pokud nahrání souboru může být volitelné
      };
  
      this.postService.createPost(newPost).subscribe(
        (post: Post) => {
          if (post.id !== undefined) {
            this.newPostId = post.id; // Přístup k ID nově vytvořeného příspěvku
            this.currentUserId = post.idUser;
          } else {
            console.error('Post creation response does not contain an ID');
          }
          this.posts.push(post);
          this.newPostContent = '';
  
          // Získání ID nově vytvořeného postu
          //this.newPostId = post.id;
          
  
          // Volání onUpload pro nahrání souboru
          if (this.selectedFile) {
            this.onUpload();
          }
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
  

  onUpload(): void {
    if (!this.selectedFile || !this.newPostId) {
      console.log('No file selected or newPostId not available');
      return;
    }
  
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
  
    // Přidání dalších informací do formulářových dat
    uploadData.append('idUser', this.currentUserId.toString());
    uploadData.append('idPost', this.newPostId.toString());
  
    this.http.post('http://localhost:8080/api/uploads', uploadData, { responseType: 'text' })
      .pipe(
        tap(response => {
          console.log('Upload successful:', response);
        }),
        catchError(error => {
          console.error('Upload error:', error);
          return of(''); // Zpracování chyby
        })
      )
      .subscribe();
  }


  loadUploads(): void {
    this.uploadService.getUploadsForPost(this.postId).subscribe(
      uploads => this.uploads = uploads,
      error => console.error('Error loading uploads:', error)
    );
  }

  getFileUrl(uploadId: number): string {
    return `http://localhost:8080/api/uploads/download/${uploadId}`;
  }
  



}
