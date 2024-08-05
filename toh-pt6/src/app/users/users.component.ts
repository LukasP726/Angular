import { Component, OnInit } from '@angular/core';
import { Role, User } from './../user';
import { UserService } from './../user.service';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[]  = [];
  roles: Role[] = [];
  //selectedRole!: Role;
  selectedRole: any = null;

  constructor(private roleService: RoleService,private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
    this.getRoles();
    this.selectedRole = this.roles[0]
    /*
    if (this.roles.length > 0) {
      this.selectedRole = this.roles[0];
    }
      */

  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe(roles => {
      //console.log('Roles:', roles);
      this.roles = roles;
    });
  }

  add(firstName: string, lastName: string, login: string, password: string, email: string, idRole: number): void {
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
      idRole 
    };
  
    this.userService.addUser(newUser)
      .subscribe(user => {
        this.users.push(user);
        window.location.reload();
      });
  }
  

  delete(user: User): void {
    if (user.id === undefined) {
      console.error('User ID is undefined. Cannot delete user.');
      return;
    }
  
    // Zobrazení potvrzovacího dialogu
    const confirmDelete = confirm('Jste si jisti, že chcete uživatele odstranit?');
    if (!confirmDelete) {
      return; // Pokud uživatel klikne na "Ne", operace se přeruší
    }
  
    // Odstranění uživatele z lokálního seznamu
    this.users = this.users.filter(u => u.id !== user.id);
  
    // Volání API pro odstranění uživatele
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('User deleted successfully.');
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        // Můžete přidat kód pro obnovu seznamu uživatelů, pokud odstranění selže
        // this.users.push(user); // např. znovu přidat uživatele do seznamu
      }
    });
  }
  
}

