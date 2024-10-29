import { Component, OnInit } from '@angular/core';
import { Role, User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  unbanUser(user: User): void {
    user.isBanned = false;
    this.userService.updateUser(user).subscribe({
      next: () => {
        console.log(`User ${user.id} unbanned successfully.`);
      },
      error: (err) => {
        console.error(`Failed to unban user ${user.id}:`, err);
        user.isBanned = true; // vrácení stavu, pokud aktualizace selže
      }
    });
  }


banUser(user: User): void {
  user.isBanned = true;
  this.userService.updateUser(user).subscribe({
    next: () => {
      console.log(`User ${user.id} banned successfully.`);
    },
    error: (err) => {
      console.error(`Failed to ban user ${user.id}:`, err);
      user.isBanned = false; // vrácení stavu, pokud aktualizace selže
    }
  });
}

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
      const roleWithMaxWeight = roles.reduce((prev, current) => (prev.weight > current.weight) ? prev : current);

      // Odstranění role s největší váhou
      this.roles = roles.filter(role => role.id !== roleWithMaxWeight.id);
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

