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
  // Inicializace komponenty – načte top uživatele
  ngOnInit(): void {
   this.getTopUsers();
  }
  // Načte seznam uživatelů a zobrazí pouze 4 od 2. do 5. uživatele
  getUsers():void{
    this.userService.getUsers()
    .subscribe(users =>this.users = users.slice(1,5))
  }
  // Načte top uživatele
  getTopUsers():void{
    this.userService.getTopUsers().subscribe(users => this.users = users)
  }
}
