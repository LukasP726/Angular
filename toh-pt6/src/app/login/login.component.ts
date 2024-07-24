import { Component } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  logUser(): void {
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
