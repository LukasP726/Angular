import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
  username: string = '';
  password: string = '';
firstName: any;
lastName: any;
email: any;


  constructor(private authService: AuthService) { }

  addNewUser(): void {
    this.authService.login({ username: this.username, password: this.password })
      .subscribe(response => {
        if (response && response.token) {
          // Přihlášení bylo úspěšné
        } else {
          // Přihlášení selhalo
        }
      });
  }
}
