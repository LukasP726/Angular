import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  registrationForm: FormGroup;
  registrationSuccess: boolean = false;
  registrationFailed: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  addNewUser(): void {
    if (this.registrationForm.valid) {
      const newUser: User = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        login: this.registrationForm.value.username,
        password: this.registrationForm.value.password,
        email: this.registrationForm.value.email,
        idRole: 2 // Assign role ID, name a weight budou nahrazeny při backend operaci
      };
      
      console.log('Registering user:', newUser);

      this.authService.register(newUser).pipe(
        tap(response => {
          if (response) {
            // Zkontrolujte, zda je odpověď z backendu validní
            this.registrationSuccess = true;
            this.registrationFailed = false;
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          this.registrationSuccess = false;
          this.registrationFailed = true;
          return of(null);
        })
      ).subscribe();
      
    } else {
      this.registrationFailed = true;
    }
  }
}
