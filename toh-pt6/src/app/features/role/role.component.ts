import { Component, OnInit } from '@angular/core';
import { Role } from '../../core/models/user'; 
import { RoleService } from '../../core/services/role.service'; 

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  selectedRole: Role | undefined;

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((roles: Role[]) => this.roles = roles);
  }



  deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe(() => {
      this.roles = this.roles.filter(role => role.id !== id);
    });
  }
}
