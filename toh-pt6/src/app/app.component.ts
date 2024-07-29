import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My forum';

  isLoggedIn: boolean = false;
  isLoggedAsAdmin: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });

    this.authService.isLoggedAsAdmin().subscribe(isAdmin => {
      this.isLoggedAsAdmin = isAdmin;
    });
    
  }

  logout(): void {
    this.authService.logout();
  }
}
