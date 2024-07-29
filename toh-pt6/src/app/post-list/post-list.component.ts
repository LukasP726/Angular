import { Component, OnInit } from "@angular/core";
import { PostService } from "../post.service";
import { Post } from "../post";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  searchContent: string = '';

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPostsByContent(this.searchContent).subscribe(data => {
      this.posts = data;
    });
  }
}
