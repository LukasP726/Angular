import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Upload } from '../upload';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit {
  private baseUrl = `${environment.apiUrl}/uploads/latest-images`;

  images: Upload[] = [];
  currentIndex: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.http.get<Upload[]>(this.baseUrl)
      .subscribe((data: Upload[]) => {
        this.images = data;
      });
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
