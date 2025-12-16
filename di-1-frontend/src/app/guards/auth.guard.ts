import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../services/user.service';

export const authGuard = () => {
  return async () => {
    const router = inject(Router);
    const userService = inject(UserService);

    await userService.checkUserLogged();
    
    if (!userService.isLoggedIn()) {      
      return router.navigate(['/dashboard']);
    }

    return true;
  }
}
