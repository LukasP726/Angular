import { Component, Input } from '@angular/core';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserUpdateDTO } from '../../core/models/user-updateDTO';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user$: Observable<User | null> | null = null;
  editableUser: UserUpdateDTO | null = null;


  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private userService: UserService,
    private location: Location,
    private authService: AuthService
  ){}

// Metoda ngOnInit, která se spustí při inicializaci komponenty
ngOnInit(): void {
  // Zkontroluje autentifikaci uživatele pomocí authService
  this.authService.checkAuthentication();

  // Získá aktuálního uživatele (pokud je přihlášený)
  this.user$ = this.userService.getCurrentUser();

  // Pokud existuje uživatel, naplní editableUser objektem s jeho informacemi
  if (this.user$ != null) {
    this.user$.subscribe(user => {
      if (user) {
        this.editableUser = {
          id: user.id,
          login: user.login ?? '',  // Pokud login není null, použije se, jinak prázdný řetězec
          email: user.email ?? ''    // Pokud email není null, použije se, jinak prázdný řetězec
        };
        console.log('User loaded:', user); // Loguje informace o uživateli
      } else {
        console.log('No user data available.'); // Pokud není žádný uživatel
      }
    });
  }
}




// Metoda pro uložení změn profilu uživatele
save(): void {
  if (this.editableUser) {
    this.userService.updateProfile(this.editableUser)
      .subscribe(() => this.goBack());
  }
}

// Metoda pro návrat na předchozí stránku
goBack():void{
  this.location.back();
}


// Metoda pro odeslání formuláře pro změnu hesla
onSubmit(): void {
  // Pokud nová a potvrzovací hesla neodpovídají, zobrazí se chybová hláška
  if (this.newPassword !== this.confirmPassword) {
    alert("New passwords do not match.");
    return;
  }


    this.userService.updatePassword(this.currentPassword,this.newPassword, this.confirmPassword).subscribe(() => {
      alert("Password changed successfully.");
    }, error => {
      alert("Failed to change password.");
    });

}

}
