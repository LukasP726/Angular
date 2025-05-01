import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
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

  // Metoda pro získání uživatele na základě ID z URL
  getUser():void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.userService.getUser(id)
      .subscribe(user => {this.user = user;

        if (user) {
          this.getRole(user.idRole); // Zavolání metody getRole
        }

      });
  }
  
  // Metoda pro návrat na předchozí stránku
  goBack():void{
    this.location.back();
  }

  // Metoda pro uložení změn uživatele
  save(): void {
    if (this.user) {
      this.userService.updateUser(this.user)
      .subscribe(() => this.goBack());
    }
  }
  
  // Metoda pro získání názvu role uživatele podle ID role
  getRole(roleId: number): void {
    this.roleService.getRole(roleId).subscribe(role => {
      this.roleName = role.name;
    });
  }

}
