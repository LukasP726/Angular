import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../thread.service';
import { Thread } from '../thread';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  thread: Thread | undefined;
  posts: Post[] = [];
  newPostContent: string = '';
  currentThreadId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private postService: PostService
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
}
