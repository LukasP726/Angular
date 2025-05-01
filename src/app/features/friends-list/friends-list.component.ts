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


  constructor(private friendService: FriendService) { }

  ngOnInit(): void {
    this.loadFriends();
    
  }

  // Načtení seznamu přátel
  loadFriends() {
    this.friends$ = this.friendService.getFriends(); // Předpokládáme, že máte metodu pro získání přátel
  }

   // Odebrání přítele podle jeho ID
  removeFriend(friendId: number): void {
    this.friendService.removeFriend(friendId).subscribe({
      next: () => {
        // Aktualizace seznamu přátel po úspěšném odstranění
        this.friends$ = this.friendService.getFriends();
      },
      error: (err) => {
        console.error("Error removing friend:", err);
      }
    });
  }

  // Potvrzení a následné odstranění přítele
  confirmAndRemoveFriend(friendId: number): void {
    const confirmation = confirm('Are you sure you want to remove this friend?');
    if (confirmation) {
      this.removeFriend(friendId);
    }
  }
  
   
}
