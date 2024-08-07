import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';
import { Observable, catchError, map, of, take, tap } from 'rxjs';

// Vytvořte funkci guard
export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  console.log('Admin Guard triggered');

  return userService.getCurrentUser().pipe(
    take(1),
    map((user: User | null) => {
      console.log('User from service:', user);
      if (user && user.idRole === 1) {
        console.log('User is admin');
        return true;
      } else {
        console.log('User is not admin, redirecting to dashboard');
        router.navigate(['/dashboard']);
        return false;
      }
    }),
    catchError(error => {
      console.error('Admin guard error:', error);
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};

