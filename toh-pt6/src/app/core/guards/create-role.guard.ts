import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';  // Upravte cestu podle umístění vašeho UserService
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';

// Generická funkce guardu
export function createRoleGuard(minWeight: number): CanActivateFn {
  return (route, state) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return userService.getRoleWeightById(user.idRole).pipe(
            map(weight => {
              if (weight >= minWeight) {
                console.log(`User has required privileges (weight: ${weight}), access granted.`);
                return true;
              } else {
                console.log(`User does not have required privileges (weight: ${weight}), redirecting.`);
                router.navigate(['/dashboard']);
                return false;
              }
            })
          );
        } else {
          console.log('No user found, redirecting to dashboard.');
          router.navigate(['/dashboard']);
          return of(false);
        }
      }),
      catchError(error => {
        console.error('Error in guard:', error);
        router.navigate(['/dashboard']);
        return of(false);
      })
    );
  };
}

// Definování specifických guardů pro různé role
export const superAdminGuard = createRoleGuard(20);   // superAdmin musí mít váhu 5 nebo vyšší
export const adminGuard = createRoleGuard(10);   // Admin musí mít váhu 5 nebo vyšší
export const editorGuard = createRoleGuard(5);  // Editor musí mít váhu 2 nebo vyšší

