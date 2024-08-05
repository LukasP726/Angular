import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-detail',
  template: '', // Prázdná šablona, jelikož komponenta pouze přesměruje
})
export class PostDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        const threadId = post.idThread;
        this.router.navigate(['/threads', threadId], { queryParams: { postId } });
      },
      (error: any) => console.error('Error loading post:', error)
    );
  }
}
