import { Component, Input } from '@angular/core';
import { User } from '../../core/models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user$: Observable<User | null> | null = null;
  editableUser: User | null = null;

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private location: Location,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.authService.checkAuthentication();
    //this.checkAuthentication();
    this.user$ = this.userService.getCurrentUser();
    if(this.user$ !=null){
    this.user$.subscribe(user => {
      if (user) {
        this.editableUser = { ...user, 
            login: user.login ?? '',
            //password: user.password ?? '',
            email: user.email ?? ''

        };
        console.log('User loaded:', user);
      } else {
        console.log('No user data available.');
      }
    });
  }
    
  }




save(): void {
  if (this.editableUser) {
    this.userService.updateUser(this.editableUser)
      .subscribe(() => this.goBack());
  }
}

goBack():void{
  this.location.back();
}


onSubmit(): void {
  if (this.newPassword !== this.confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  this.userService.verifyCurrentPassword(this.currentPassword).subscribe(isMatch => {
    if (isMatch) {
      this.userService.updatePassword(this.currentPassword,this.newPassword, this.confirmPassword).subscribe(() => {
        console.log("currentPassword: ", this.currentPassword);
        console.log("newPassword: ",this.newPassword);
        console.log("confirmPassword: ", this.confirmPassword);

        alert("Password changed successfully.");
      }, error => {
        alert("Failed to change password.");
      });
    } else {
      alert("Current password is incorrect.");
    }
  });
}








}
