import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
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

  login(): void {
    this.authService.login(this.username, this.password).pipe(
      tap(() => {
        // Pokud přihlášení proběhlo úspěšně, přesměruj na dashboard
        this.loginFailed = false;
        this.router.navigate(['/dashboard']);
        //console.log("funguje to");
      }),
      catchError(error => {
        // Nastavení flagu loginFailed na true při neúspěchu
        this.loginFailed = true;
        console.error('Chyba při přihlašování:', error);
        return of(null);
      })
    ).subscribe();
  }
}
