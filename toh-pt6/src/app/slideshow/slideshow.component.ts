// slideshow.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface Upload {
  id: number;
  filename: string;
  // další vlastnosti dle potřeby
}

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {
  private imagesUrl = `${environment.apiUrl}/uploads/latest-images`;
  private uploadsUrl =`${environment.apiUrl}/uploads`;

  images: Upload[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.http.get<Upload[]>(this.imagesUrl).subscribe(
      (data) => {
        this.images = data;
      },
      (error) => {
        console.error('Chyba při načítání obrázků:', error);
      }
    );
  }

  getFileUrl(id: number): string {
    return `${this.uploadsUrl}/download/${id}`;

  }
}
