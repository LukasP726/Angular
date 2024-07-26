import { Component, Input } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from '../role.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService  
  ){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user) => this.user = user,
      (error) => console.error('Error fetching user:', error)
    );
  }

  goBack():void{
    this.location.back();
  }

  save(): void {
    if (this.user) {
      this.userService.updateUser(this.user)
      .subscribe(() => this.goBack());
    }
  }



}
