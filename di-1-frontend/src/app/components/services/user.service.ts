import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, lastValueFrom, map, of, tap } from 'rxjs';

import { RequestsAuthService } from '././http/requests/requests-auth.service';

import { User } from './../models/auth.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  constructor(
    private router: Router,
    private requestAuth: RequestsAuthService) { }
    
  public isLoggedIn = signal<boolean>(false);

  public async checkUserLogged(): Promise<boolean> {
    return await lastValueFrom(
      this.requestAuth.checkAuthStatus().pipe(
        map(res => ('data' in res && res.status === 200)),
        tap(isAuth => this.isLoggedIn.set(isAuth)),
        catchError(() => {
          this.isLoggedIn.set(false);
          return of(false);
        })
      )
    );
  }

  public async checkUser(): Promise<any> {
    const user = await lastValueFrom(this.requestAuth.checkAuthStatus());

    return user;
  }

  public async logout(): Promise<void> {
    await lastValueFrom(this.requestAuth.logout());

    await this.router.navigate([ '/dashboard' ]);
  }

}
