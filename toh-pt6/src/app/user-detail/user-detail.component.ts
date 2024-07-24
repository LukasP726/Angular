import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{
  @Input() user?: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location  ){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser():void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.userService.getUser(id)
      .subscribe(user => this.user = user);
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
