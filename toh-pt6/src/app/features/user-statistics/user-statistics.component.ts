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

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent {

  @Input() user?: User;
  roleName: string | undefined ;
  uploads: Upload[] = [];
  posts: Post[] = [];
  threads: Thread[] = [];
  frequency: number = 0;
  uploadsCount: number = 0;
  threadsCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService,  
    private uploadService: UploadService,
    private postService: PostService,
    private threadService: ThreadService,
  ){}

  ngOnInit(): void {
    this.getUser();
    this.getUploads();
    this.getPosts();
    this.getThreads();
  }

  getUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
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

}
