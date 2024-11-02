import { Component, Input } from '@angular/core';
import { User } from '../../core/models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';
import { Location } from '@angular/common';
import { UploadService } from '../../core/services/upload.service';
import { PostService } from '../../core/services/post.service';
import { ThreadService } from '../../core/services/thread.service';
import { Upload } from '../../core/models/upload'; 
import { Post } from '../../core/models/post';
import { Thread } from '../../core/models/thread';
import { FriendService } from '../../core/services/friend.service';
import { catchError, Observable, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent {

  @Input() user?: User;
  //currentUser: User | null = null;
  user$: Observable<User | null> | null = null;
  roleName: string | undefined ;
  uploads: Upload[] = [];
  posts: Post[] = [];
  threads: Thread[] = [];
  frequency: number = 0;
  uploadsCount: number = 0;
  threadsCount: number = 0;
  currentUserId: number | undefined;
  isFriend: boolean = false;
  

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService,  
    private uploadService: UploadService,
    private postService: PostService,
    private threadService: ThreadService,
    private friendService: FriendService,
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    //this.currentUserId = parseInt(localStorage.getItem('id')!, 10); // nebo jiná metoda získání ID
    this.getCurrentUser();
    ///console.log("currentUser: "+this.currentUserId);
    this.getUser();
    this.getUploads();
    this.getPosts();
    this.getThreads();
    //this.checkIfFriend();
   
  }


  checkIfFriend(): void {
      this.friendService.checkIfFriend(this.user!.id!).subscribe((result: boolean) => {
        this.isFriend = result;
      });
    
  }
  getCurrentUser(): void {
    // Odebíráme se k observable, abychom zjistili, zda je uživatel přihlášen
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // Pokud je uživatel přihlášen, pokusíme se získat jeho údaje
        this.user$ = this.userService.getCurrentUser();
  
        if (this.user$ != null) {
          this.user$.pipe(
            catchError((error) => {
              console.error('Chyba při získávání aktuálního uživatele:', error);
              this.currentUserId = -1; // Nastavíme hodnotu na -1 při chybě
              return of(null); // Vrátíme prázdnou hodnotu pro pokračování bez chyby
            })
          ).subscribe(user => {
            if (user) {
              this.currentUserId = user.id;
            } else {
              this.currentUserId = -1;
            }
          });
        }
      } else {
        // Pokud není uživatel přihlášen, nastavíme currentUserId na -1
        this.currentUserId = -1;
      }
    });
  }

  getUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
   //console.log("id: "+id);

    this.userService.getUser( id).subscribe({
      next: user => {
        if (user) {
          this.user = user;
          this.checkIfFriend();
        } else {
          console.error("User data is null or undefined");
        }
      },
    error: err => console.error("Error fetching user:", err)
    });


  }

  getUploads(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.uploadService.getUploadsByUserId(id)
      .subscribe(uploads => {
        this.uploads = uploads;
        this.uploadsCount = uploads.length;
      });
  }

  getPosts(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.postService.getPostsByUserId(id)
      .subscribe(posts => {
        this.posts = posts;
        this.frequency = posts.length;
      });
  }

  getThreads(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.threadService.getThreadsByIdUser(id)
      .subscribe(threads => {
        this.threads = threads;
        this.threadsCount = threads.length;
      });
  }

  goBack(): void {
    this.location.back();
  }


  sendFriendRequest(userId: number): void {
    this.friendService.sendFriendRequest(userId).subscribe(
      response => {
        alert('Friend request sent!');
        //this.checkIfFriend(); // Aktualizace stavu
      },
      error => {
        alert('Failed to send friend request');
        console.error(error);
      }
    );
  }


}
