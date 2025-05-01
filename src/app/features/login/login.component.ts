import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }
  
  // Metoda pro přihlášení uživatele
  login(): void {
    // Zavolá službu pro přihlášení a předá uživatelské jméno a heslo
    this.authService.login(this.username, this.password).pipe(
      tap(() => {
        // Pokud přihlášení proběhlo úspěšně, přesměruj na dashboard
        this.loginFailed = false;
        this.router.navigate(['/dashboard']);
      }),
      catchError(error => {
        // Nastavení flagu loginFailed na true při neúspěchu
        this.loginFailed = true;
        return of(null);
      })
    ).subscribe();
  }
}
