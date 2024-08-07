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
import { catchError, of, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  highlightedPostId: number | null = null;
  uploads: { [postId: number]: Upload[] } = {};
  thread: Thread | undefined;
  posts: Post[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;
  selectedFiles: File[] = [];
  filePreviews: { file: File, url: string }[] = [];
  currentUserId: number | undefined;
  currentUser: User | null = null;
  newPostId: number | undefined;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private postService: PostService,
    private http: HttpClient,
    private uploadService: UploadService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentThreadId = +params['id'];
      this.highlightedPostId = +params['id'];
      this.loadThread();
      this.loadPosts();

    });

    this.userService.getCurrentUser().subscribe(user => {
      this.currentUserId = user?.id; // Nastav aktuální ID uživatele
    });
  }

  getThread(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.threadService.getThread(id)
      .subscribe(thread => this.thread = thread);
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
        return; // Ukonči funkci, pokud není uživatelské ID
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
          } else {
            console.error('Post creation response does not contain an ID');
          }
          this.posts.push(post);
          this.newPostContent = '';

          if (this.selectedFiles.length > 0) {
            this.onUpload();
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
        // Informuj uživatele nebo vykonej jinou akci
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
}
