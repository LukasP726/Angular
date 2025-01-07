import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { Role, User } from '../../core/models/user';
import { RoleService } from '../../core/services/role.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{
  @Input() user?: User;
  roleName: string | undefined ;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService  
  ){}

  ngOnInit(): void {
    this.getUser();
  }

  getUser():void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.userService.getUser(id)
      .subscribe(user => {this.user = user;

        if (user) {
          this.getRole(user.idRole); // Zavolání metody getRole
        }

      });
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

  getRole(roleId: number): void {
    this.roleService.getRole(roleId).subscribe(role => {
      this.roleName = role.name;
    });
  }

}
