import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { createRoleGuard } from './create-role.guard';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

describe('createRoleGuard', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    const userService = jasmine.createSpyObj('UserService', ['getCurrentUser', 'getRoleWeightById']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
      ],
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create guard and return true if user has sufficient weight', (done) => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'hashedpassword',
      email: 'john.doe@example.com',
      idRole: 1,
    };

    userServiceSpy.getCurrentUser.and.returnValue(of(mockUser)); // Correct mock data
    userServiceSpy.getRoleWeightById.and.returnValue(of(5)); // Mock weight

    const guardFn = createRoleGuard(3); // 3 as the minimum required weight

    const result = guardFn(mockRoute, mockState);

    if (result instanceof Observable) {
      result.subscribe((res) => {
        expect(res).toBeTrue();
        done();
      });
    }
  });

  it('should create guard and redirect to dashboard if user does not have sufficient weight', (done) => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'hashedpassword',
      email: 'john.doe@example.com',
      idRole: 1,
    };

    userServiceSpy.getCurrentUser.and.returnValue(of(mockUser)); // Correct mock data
    userServiceSpy.getRoleWeightById.and.returnValue(of(1)); // Mock weight below the required threshold

    const guardFn = createRoleGuard(3); // 3 as the minimum required weight

    const result = guardFn(mockRoute, mockState);

    if (result instanceof Observable) {
      result.subscribe((res) => {
        expect(res).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        done();
      });
    }
  });
});
