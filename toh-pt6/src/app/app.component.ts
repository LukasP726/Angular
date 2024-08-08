import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './user';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My forum';

  isLoggedIn: boolean = false;
  isLoggedAsAdmin: boolean = false;
  isLoggedAsEditor: boolean = false;
  user: User | null = null;

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef,
    private zone: NgZone
  ) { }
  
  // Po aktualizaci hodnot
  /*
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  
    this.userService.getCurrentUser().subscribe(user => {
      this.zone.run(() => {
        this.user = user;
        this.isLoggedAsAdmin = user && user.idRole === 1;
        this.isLoggedAsEditor = user && user.idRole <= 2;
        this.cdr.detectChanges();
      });
    });
  }
*/

ngOnInit(): void {
  this.authService.isLoggedIn().subscribe(status => {
    this.isLoggedIn = status;
    this.cdRef.detectChanges(); // Přidáno pro detekci změn

    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        switch(user.idRole){
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


  });


}
  logout(): void {
    this.authService.logout();
  }
}
