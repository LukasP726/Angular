import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../../core/services/thread.service';
import { PostService } from '../../core/services/post.service';
import { UploadService } from '../../core/services/upload.service';
import { HttpClient} from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { Thread } from '../../core/models/thread';
import { Post } from '../../core/models/post';
import { Upload } from '../../core/models/upload';
import { catchError, of, tap } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import { DomSanitizer } from '@angular/platform-browser';


import { Renderer2 } from '@angular/core';
import { PostDTO } from '../../core/models/postDTO';
import { environment } from '../../environments/environment';

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
  posts: PostDTO[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;
  selectedFiles: File[] = [];
  filePreviews: { file: File, url: string }[] = [];
  currentUserId: number | undefined;
  currentUser: User | null = null;
  newPostId: number | undefined;
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
    
  ) {

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

  // Metoda pro načtení dat konkrétního tématu (thread) podle jeho ID
  loadThread(): void {
    if (this.currentThreadId !== undefined) {
      this.threadService.getThreadById(this.currentThreadId).subscribe(
        (thread: Thread) => this.thread = thread,
        (error: any) => console.error('Error loading thread:', error)
      );
    }
  }

  // Metoda pro načtení příspěvků (posts) spojených s konkrétním tématem (thread)
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
  
  // Metoda pro přidání příspěvku
  addPost(): void {
    if (this.newPostContent.trim()) {
      if (this.currentUserId === undefined) {
        console.error('Current user ID is not defined');
        return;
      }

      // Identifikace URL v obsahu
      const urlPattern = /https?:\/\/[^\s]+/g;
      const urls = this.newPostContent.match(urlPattern);

      if (urls && urls.length > 0) {
        // Zavolán backend pro validaci každé URL
        urls.forEach((url) => {
          this.postService.validateUrl(url);
        });
      }

      // Vytvoření příspěvku po validaci URL
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
            this.posts.unshift(post);
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




  // Metoda pro zpracování vybraných souborů z input elementu
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      this.updateFilePreviews();
    }
  }
  
  // Metoda pro aktualizaci náhledů souborů na základě vybraných souborů
  updateFilePreviews(): void {
    this.filePreviews = this.selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
  }

  // Metoda pro odstranění souboru na základě jeho inde
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.updateFilePreviews();
  } 
  
  // Metoda pro vymazání všech vybraných souborů a náhledů
  clearSelectedFiles(): void {
    this.selectedFiles = [];
    this.filePreviews = [];
  }

  // Metoda pro nahrání souborů (v případě více souborů)
onUpload(): void {
  // Pokud nejsou vybrány žádné soubory nebo není dostupný nový Post ID, ukončíme funkci
  if (this.selectedFiles.length === 0 || !this.newPostId) {
    console.log('No files selected or newPostId not available');
    return;
  }

  // Počet uploadovaných souborů
  let uploadCount = 0;
  // Celkový počet souborů k nahrání
  let totalUploads = this.selectedFiles.length;

  // Iterujeme přes všechny vybrané soubory
  this.selectedFiles.forEach(file => {
    const uploadData = new FormData();
    
    // Kontrola, jestli je definováno ID aktuálního uživatele
    if (this.currentUserId === undefined) {
      console.error('Current user ID is not defined');
      return;
    }

    // Přidáme soubor a další data do FormData objektu
    uploadData.append('file', file, file.name);
    uploadData.append('idUser', this.currentUserId.toString());
    uploadData.append('idPost', this.newPostId!.toString());

    // Odeslání POST požadavku na server pro nahrání souboru
    this.http.post(`${environment.apiUrl}/uploads`, uploadData, { responseType: 'text' })
      .pipe(
        // Po úspěšném nahrání souboru
        tap(response => {
          console.log('Upload successful:', response);
          uploadCount++;
          
          // Po nahrání všech souborů (pokud je uploadCount == totalUploads)
          if (uploadCount === totalUploads) {
            // Načteme uploady pro daný post znovu
            this.uploadService.getUploadsForPost(this.newPostId!).subscribe(
              (uploads: Upload[]) => {
                this.uploads[this.newPostId!] = uploads;
              },
              (error: any) => console.error('Error reloading uploads:', error)
            );
          }
        }),
        // Zpracování chyby během uploadu
        catchError(error => {
          console.error('Upload error:', error);
          return of(''); // Vrací prázdný řetězec nebo jinou hodnotu
        })
      )
      .subscribe(); // Spustí Observable
  });
}

  
  // Metoda pro načtení uploadů pro každý příspěvek
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

  // Metoda pro získání URL pro stažení souboru podle jeho ID
  getFileUrl(uploadId: number): string {
    return `${environment.apiUrl}/uploads/download/${uploadId}`;
  }

  // Metoda pro hladké posunutí na označený příspěvek
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
  
  // Metoda pro zobrazení HTML obsahu
  sanitizerBypass(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }


  // Metoda pro kontrolu, zda je soubor obrázek podle přípony
  isImage(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension || '');
  }


  // Metoda pro kontrolu, zda je soubor audio souborem podle přípony
  isAudio(filename: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
    const extension = filename.split('.').pop()?.toLowerCase();
    return audioExtensions.includes(extension || '');
  }



  // Metoda pro získání uživatelského jména na základě ID uživatele
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

  // Získání jména vlastníka vlákna 
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
