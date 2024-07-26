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
  loginFailed: boolean= false;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.username, this.password).pipe(
      tap(response => {
        if (response && response.token) {
          this.loginFailed = false;
          this.router.navigate(['/dashboard']); // Redirect to the dashboard or any other route
        } else {
          this.loginFailed = true;
        }
      }),
      catchError(error => {
        this.loginFailed = true;
        return of(null);
      })
    ).subscribe({
      next: () => {},
      error: () => { this.loginFailed = true; },
      complete: () => {}
    });
  }
}
