import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { Observable, catchError, map, of, take, tap } from 'rxjs';

// Vytvořte funkci guard
export const editorGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  console.log('Editor Guard triggered');

  return userService.getCurrentUser().pipe(
    take(1),
    map((user: User | null) => {
      console.log('User from service:', user);
      if (user && user.idRole <= 2) {
        console.log('User has editor higher privileges');
        return true;
      } else {
        console.log('User is not editor, redirecting to dashboard');
        router.navigate(['/dashboard']);
        return false;
      }
    }),
    catchError(error => {
      console.error('Editor guard error:', error);
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};

