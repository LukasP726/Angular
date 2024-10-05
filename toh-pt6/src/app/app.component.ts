import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { User } from './core/models/user';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// app.component.ts
export class AppComponent {
  title = 'My forum';

  isLoggedIn: boolean = false;
  isLoggedAsAdmin: boolean = false;
  isLoggedAsEditor: boolean = false;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
      this.cdRef.detectChanges(); // Přidáno pro detekci změn

      if (this.isLoggedIn) {
        this.userService.getCurrentUser().subscribe(user => {
          if (user) {
            this.user = user;
            switch (user.idRole) {
              case 1:
                this.isLoggedAsAdmin = true;
                this.isLoggedAsEditor = true;
                break;
              case 2:
                this.isLoggedAsEditor = true;
                break;
              default:
                this.isLoggedAsAdmin = false;
                this.isLoggedAsEditor = false;
                break;
            }
            this.cdRef.detectChanges(); // Přidáno pro detekci změn
          }
        });
      } else {
        this.isLoggedAsAdmin = false;
        this.isLoggedAsEditor = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
