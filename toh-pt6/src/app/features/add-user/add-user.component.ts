
import { Component, OnInit } from '@angular/core';
import { Role, User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  selectedRole: any = null;
  roles: Role[] = [];

  constructor(private roleService: RoleService,private userService: UserService) { }

  ngOnInit() {
    
    this.getRoles();
    this.selectedRole = this.roles[0]


  }

  getRoles(): void {
    this.roleService.getRoles().subscribe(roles => {
      //console.log('Roles:', roles);
      const roleWithMaxWeight = roles.reduce((prev, current) => (prev.weight > current.weight) ? prev : current);

      // Odstranění role s největší váhou
      this.roles = roles.filter(role => role.id !== roleWithMaxWeight.id);
    });
  }

  add(firstName: string, lastName: string, login: string, password: string, email: string, idRole: number, isBanned: boolean): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    login = login.trim();
    password = password.trim();
    email = email.trim();
  
    if (!firstName || !lastName || !login || !password || !email || !idRole) { 
      console.error('All fields must be filled in.');
      return; 
    }
  
    const newUser: User = { 
      id: undefined, 
      firstName, 
      lastName, 
      login, 
      password, 
      email, 
      idRole,
      isBanned
    };
  
    this.userService.addUser(newUser)
      .subscribe(user => {
        window.location.reload();
      });
  }

}
