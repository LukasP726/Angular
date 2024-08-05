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

highlightedPostId: number | null = null;
uploads: { [postId: number]: Upload[] } = {}; // Mapa uploadů podle postId
idPost: number = 1;
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
      this.highlightedPostId = +params['id'];
      this.loadThread();
      this.loadPosts();
      //this.loadUploads();
    }); 

    this.route.queryParams.subscribe(params => {
      this.highlightedPostId = +params['postId'] || null;
    });
  }

  getThread():void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.threadService.getThread(id)
      .subscribe(thread=> this.thread = thread);
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
        (posts: Post[]) => {
          this.posts = posts;
          this.scrollToHighlightedPost();
          this.loadUploadsForPosts(); // Načtení uploadů pro všechny příspěvky
        },
        (error: any) => console.error('Error loading posts:', error)
      );
    }}
  

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
            console.log("ok");
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


loadUploadsForPosts(): void {
  this.posts.forEach(post => {
    if (post.id !== undefined) {
      this.uploadService.getUploadsForPost(post.id).subscribe(
        (uploads: Upload[]) => {
          this.uploads[post.id!] = uploads;
          //console.log(`Post ID: ${post.id}, Uploads:`, uploads);
        },
        (error: any) => console.error('Error loading uploads for post:', error)
      );
    } else {
      console.error('Post ID is undefined');
    }
  });
}




  getFileUrl(uploadId: number): string {
    return `http://localhost:8080/api/uploads/download/${uploadId}`;
  }


  scrollToHighlightedPost(): void {
    if (this.highlightedPostId !== undefined) {
      setTimeout(() => {
        const element = document.getElementById('post-' + this.highlightedPostId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlighted');
        }
      }, 0);
    }
  }

  isImage(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension || '');
  }
  



}
