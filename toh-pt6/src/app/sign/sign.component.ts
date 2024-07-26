import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  idRole: number = 1;

registrationSuccess: boolean = false;
registrationFailed: boolean = false;


  constructor(private authService: AuthService) { }

  addNewUser(): void {
    const newUser: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      login: this.username,
      password: this.password,
      email: this.email,
      idRole: this.idRole // Assign role ID, name a weight budou nahrazeny při backend operaci
    };
    
    console.log('Registering user:', newUser);

    this.authService.register(newUser).pipe(
      tap(response => {
        if (response && response.id) {
          // Registrace byla úspěšná
          this.registrationSuccess = true;
          this.registrationFailed = false;
        } else {
          // Registrace selhala
          this.registrationSuccess = false;
          this.registrationFailed = true;
        }
      }),
      catchError(error => {
        // Registrace selhala
        this.registrationSuccess = false;
        this.registrationFailed = true;
        return of(null);
      })
    ).subscribe();
  }
}
  

