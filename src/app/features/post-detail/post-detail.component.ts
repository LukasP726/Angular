import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post';

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

// Metoda ngOnInit, která se spustí při inicializaci komponenty
ngOnInit(): void {
  // Získá postId z URL parametru pomocí snapshotu z route
  const postId = +this.route.snapshot.paramMap.get('id')!; // Použití '+' pro konverzi na číslo

  // Zavolá službu pro získání příspěvku podle id
  this.postService.getPostById(postId).subscribe(
    (post: Post) => {
      // Po úspěšném načtení příspěvku získá idThread (id vlákna)
      const threadId = post.idThread;

      // Přesměruje na stránku s daným vláknem a přidá postId jako query parametr
      this.router.navigate(['/threads', threadId], { queryParams: { postId } });
    },
    (error: any) => console.error('Error loading post:', error) // Zpracování chyby při načítání příspěvku
  );
}

}
