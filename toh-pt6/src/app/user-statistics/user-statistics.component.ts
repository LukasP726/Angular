import { Component, Input } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { RoleService } from '../role.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent {

  @Input() user?: User;
  roleName: string | undefined ;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private roleService: RoleService  
  ){}
  frequency:number=1;
  /*
  musí zobrazit frequency, čili počet postů
  dále počet threadů do kterých se postovalo
  a počet uploadů
  */ 
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

}
