import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { UserService } from '../services/user.service';
import { RequestsAuthService } from '../services/http/requests/requests-auth.service';

let userService!: UserService;
let reqAuthService!: RequestsAuthService;

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  userService = inject(UserService);
  reqAuthService = inject(RequestsAuthService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLogStatus = request.url.includes('/auth/me');
      const isLogin = request.url.includes('/auth/login');
      const isRegister = request.url.includes('/auth/register');

      const isAuthCheck = isLogStatus || isLogin || isRegister;

      if (error.status === 401 && isLogStatus && !userService.isLoggedIn()) {
        return throwError(() => null); 
      }

      if (error.status === 401 && !isAuthCheck && userService.isLoggedIn()) {
        userService.logout();
      }

      if (error.status === 498 && !isLogStatus) {
        userService.logout();
      }

      return throwError(() => error);
    })
  );
};
