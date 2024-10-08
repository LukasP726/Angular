import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  users: User[] = [];


  constructor(private userService: UserService) { }

  ngOnInit(): void {
   //this.getUsers();
   this.getTopUsers();
  }

  getUsers():void{
    this.userService.getUsers()
    .subscribe(users =>this.users = users.slice(1,5))
  }
  getTopUsers():void{
    this.userService.getTopUsers().subscribe(users => this.users = users)
  }
}
