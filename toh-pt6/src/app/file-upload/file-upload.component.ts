import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      console.log('No file selected');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post('http://localhost:8080/api/upload', uploadData, { responseType: 'text' })
      .pipe(
        tap(response => {
          // Zpracování odpovědi
          console.log('Upload successful:', response);
        }),
        catchError(error => {
          // Zpracování chyby
          console.error('Upload error:', error);
          return of(''); // Vrátí prázdný řetězec nebo jinou hodnotu, která bude vhodná pro tvoje použití
        })
      )
      .subscribe(); // Je stále platné, ale pouze pro spouštění Observable
  }
}
