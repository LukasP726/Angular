import { Component, OnInit } from '@angular/core';
import { User } from './../user';
import { UserService } from './../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[]  = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  add(firstName: string, lastName: string, login: string, password: string, email: string): void {
    firstName = firstName.trim();
    lastName = lastName.trim();
    login = login.trim();
    password = password.trim();
    email = email.trim();
    if (!firstName || !lastName || !login || !password || !email) { return; }
    const newUser: User = { id: 0, firstName, lastName, login, password, email, role: { id: 0, name: '', weight: 0 } };
    this.userService.addUser(newUser)
      .subscribe(user => {
        this.users.push(user);
      });
  }

  delete(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.userService.deleteUser(user.id).subscribe();
  }
}

