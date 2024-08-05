import { Component, Input } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from '../role.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user$: Observable<User> | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService  
  ){}

  ngOnInit(): void {
    this.checkAuthentication();
    this.user$ = this.userService.getCurrentUser();
    this.user$.subscribe(user => {
      if (user) {
        console.log('User loaded:', user);
      } else {
        console.log('No user data available.');
      }
    });

    
  }

 private checkAuthentication() {
    const token = localStorage.getItem('auth_token'); // Předpokládejme, že token je uložen v localStorage

    if (!token) {
        // Není přihlášený, přesměrujte na přihlašovací stránku
        window.location.href = '/login';
    }
}








}
