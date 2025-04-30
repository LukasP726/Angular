import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../core/services/friend.service';
import { Observable } from 'rxjs';
import { FriendRequest } from '../../core/models/friend-request';
import { FriendRequestDTO } from '../../core/models/friend-requestDTO';
//import { FriendRequest }  // Předpokládáme, že máte model žádosti o přátelství

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {
  friendRequests$: Observable<FriendRequestDTO[]> | undefined;


  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadFriendRequests();
  }

  loadFriendRequests() {


    /*
    this.friendService.getFriendRequests().subscribe(friendRequests => {
      this.friendRequests$  = friendRequests;
      console.log(friendRequests);
    });
*/
    //this.friendRequests$ = this.friendService.getFriendRequests(); 
    this.friendRequests$ = this.friendService.getRequestsDTO(); 
    
  }

  acceptRequest(requestId: number) {
    this.friendService.acceptFriendRequest(requestId).subscribe(() => {
      this.loadFriendRequests(); // Znovu načteme žádosti po akceptaci
    });
  }
}
