import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { PostService } from '../post.service';
import { UploadService } from '../upload.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Thread } from '../thread';
import { Post } from '../post';
import { Upload } from '../upload';
import { catchError, of, tap, forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../user';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Renderer2 } from '@angular/core';
import { PostDTO } from '../postDTO';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  userNames: Map<number, string> = new Map();


  highlightedPostId: number | null = null;
  uploads: { [postId: number]: Upload[] } = {};
  thread: Thread | undefined;
  threadOwner: string | undefined;
  //posts: Post[] = [];
  posts: PostDTO[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;
  selectedFiles: File[] = [];
  filePreviews: { file: File, url: string }[] = [];
  currentUserId: number | undefined;
  currentUser: User | null = null;
  newPostId: number | undefined;
  //isLoggedIn$: Observable<boolean>;

  // Stránkovací proměnné
  itemsPerPage: number = 10;
  currentPage: number = 1;
  isLoggedIn$ = this.authService.isLoggedIn();
  isAdmin$ = this.authService.isLoggedAsAdmin();



  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private postService: PostService,
    private http: HttpClient,
    private uploadService: UploadService,
    private authService: AuthService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
    
  ) {
    //this.isLoggedIn$ = this.authService.isLoggedIn();
    //this.isAdmin$
  }

  ngOnInit(): void {
    
    this.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.userService.getCurrentUser().subscribe(user => {
          this.currentUserId = user?.id;
        })
      } 
    });

    // Načtení ID vlákna z parametrů URL
    this.route.params.subscribe(params => {
      this.currentThreadId = +params['id'];
      this.loadThread();
      this.loadPosts();
    });

    // Načtení ID zvýrazněného příspěvku z parametrů URL
    this.route.queryParams.subscribe(params => {
      this.highlightedPostId = +params['postId'] || null;
    });

    this.getOwnerOfThread(this.currentThreadId!);

    
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
        (posts: PostDTO[]) => {
          this.posts = posts;
          this.scrollToHighlightedPost();
          this.loadUploadsForPosts();
        },
        (error: any) => console.error('Error loading posts:', error)
      );
    }
  }




  

  

  addPost(): void {
    if (this.newPostContent.trim()) {
      if (this.currentUserId === undefined) {
        console.error('Current user ID is not defined');
        return;
      }

      if (this.containsScript(this.newPostContent)) {
        this.executeScript(this.newPostContent);
        console.log("this.newPostContent-true: ",this.newPostContent);
      } 
      else{
        console.log("this.newPostContent-false: ",this.newPostContent);

      }

      const newPost: Post = {
        content: this.newPostContent,
        idUser: this.currentUserId,
        idThread: this.currentThreadId!,
        createdAt: new Date(),
        idUpload: null
      };

      this.postService.createPost(newPost).subscribe(
        (post: Post) => {
          if (post.id !== undefined) {
            this.newPostId = post.id;
            this.posts.unshift(post);  // Přidání nového příspěvku na začátek seznamu
            this.newPostContent = '';
            if (this.selectedFiles.length > 0) {
              this.onUpload();
            }
          } else {
            console.error('Post creation response does not contain an ID');
          }
        },
        (error: any) => console.error('Error creating post:', error)
      );
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.updateFilePreviews();
    }
  }

  updateFilePreviews(): void {
    this.filePreviews = this.selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.updateFilePreviews();
  }

  clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.filePreviews = [];
  }

  onUpload(): void {
    if (this.selectedFiles.length === 0 || !this.newPostId) {
      console.log('No files selected or newPostId not available');
      return;
    }

    this.selectedFiles.forEach(file => {
      const uploadData = new FormData();
      if (this.currentUserId === undefined) {
        console.error('Current user ID is not defined');
        return;
      }
      
      uploadData.append('file', file, file.name);
      uploadData.append('idUser', this.currentUserId.toString());
      uploadData.append('idPost', this.newPostId!.toString());

      this.http.post('http://localhost:8080/api/uploads', uploadData, { responseType: 'text' })
        .pipe(
          tap(response => {
            console.log('Upload successful:', response);
          }),
          catchError(error => {
            console.error('Upload error:', error);
            return of('');
          })
        )
        .subscribe();
    });
  }

  loadUploadsForPosts(): void {
    this.posts.forEach(post => {
      if (post.id !== undefined) {
        this.uploadService.getUploadsForPost(post.id).subscribe(
          (uploads: Upload[]) => {
            this.uploads[post.id!] = uploads;
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

  sanitizerBypass(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  isImage(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension || '');
  }

  isAudio(filename: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return audioExtensions.includes(extension || '');
  }

  addScript(command:string) {
    const script = this.renderer.createElement('script');
    script.src = 'data:text/javascript;base64,' + btoa(`
      console.log('Script Executed!');
      alert('Script Executed!');
    `);
    script.type = 'text/javascript';
    this.renderer.appendChild(document.body, script);
  }

  containsScript(content: string): boolean {
    return /<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(content);
  }
  
  executeScript(content: string) {
    const scriptContent = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
    if (scriptContent && scriptContent.length > 1) {
      const script = this.renderer.createElement('script');
      script.text = scriptContent[1]; // Obsah mezi <script>...</script>
      this.renderer.appendChild(document.body, script);
    }
  }


  getUserName(userId: number): string {
    let userName = '';
    this.userService.getUser(userId).subscribe((user: User) => {
      userName = user.login;
    });
    return userName;
  }


  
  // Úprava příspěvku
  editPost(post: Post) {
    const editedContent = prompt('Edit your post', post.content);
    if (editedContent !== null) {
      post.content = editedContent;
      this.postService.updatePost(post.id!, post).subscribe(updatedPost => {
        // Aktualizace zobrazení příspěvku
        const index = this.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      });
    }
  }

  // Smazání příspěvku
  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe(() => {
        // Odstranění příspěvku z pole příspěvků
        this.posts = this.posts.filter(post => post.id !== postId);
      });
    }
  }

  getOwnerOfThread(idThread: number): void {
    this.threadService.getOwnerOfThread(idThread).subscribe({
      next: (ownerName: string) => {
        this.threadOwner = ownerName;
        console.log('Thread Owner Name:', ownerName);
      },
      error: (error) => {
        console.error('Chyba při získávání jména vlastníka vlákna:', error);
      }
    });
  }
  
}
