import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../core/services/friend.service';
import { Observable } from 'rxjs';
import { FriendRequestDTO } from '../../core/models/friend-requestDTO';


@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {
  friendRequests$: Observable<FriendRequestDTO[]> | undefined;


  constructor(private friendService: FriendService) { }

  // Načte žádosti o přátelství při inicializaci komponenty
  ngOnInit(): void {
    this.loadFriendRequests();
  }

  // Načte žádosti o přátelství
  loadFriendRequests() {
    this.friendRequests$ = this.friendService.getRequestsDTO(); 
  }
  
  // Akceptuje žádost o přátelství a znovu načte seznam žádostí
  acceptRequest(requestId: number) {
    this.friendService.acceptFriendRequest(requestId).subscribe(() => {
      this.loadFriendRequests(); // Znovu načteme žádosti po akceptaci
    });
  }
}
