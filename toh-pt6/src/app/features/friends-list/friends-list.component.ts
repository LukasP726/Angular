import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../core/services/friend.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  friends$: Observable<User[]> | undefined;
  //friends$: User[] | undefined;


  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadFriends();
    
  }

  loadFriends() {
    
    this.friends$ = this.friendService.getFriends(); // Předpokládáme, že máte metodu pro získání přátel
    /*
    this.friendService.getFriends().subscribe(friends => {
      this.friends$ = friends;
      console.log(friends);
    });
     */
  }
   
}
