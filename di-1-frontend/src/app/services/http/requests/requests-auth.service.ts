import { Injectable } from '@angular/core';

import { XSSService } from './../xss.service';
import { HttpService } from './../http.service';

import { LoginBody, RegisterBody, User, UserPasswordUpdate } from './../../../models/auth.model';

import { env } from './../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})

export class RequestsAuthService {

  constructor(
    private xSSService: XSSService,
    private httpService: HttpService) { }

  public login(body: LoginBody) {
    const cleanBody = this.xSSService.clean(body);
    const url = env.apiUrl + env.endpoints.auth.login;

    return this.httpService.post<LoginBody, void>(url, cleanBody);
  }

  public register(body: RegisterBody) {
    const cleanBody = this.xSSService.clean(body);
    const url = env.apiUrl + env.endpoints.auth.register;

    return this.httpService.post<RegisterBody, void>(url, cleanBody);
  }
  
  public logout() {
    const url = env.apiUrl + env.endpoints.auth.logout;
 
    return this.httpService.get(url);
  }
  
  public changePassword(user: UserPasswordUpdate) {
    const cleanBody = this.xSSService.clean(user);
    const url = env.apiUrl + env.endpoints.auth.changePassword;

    return this.httpService.patch<Partial<UserPasswordUpdate>, void>(url, cleanBody);
  }

  public deleteUser(userId: string) {
    const url = env.apiUrl + env.endpoints.user.account + userId;

    return this.httpService.delete<void>(url)
  }

  public update(user: User) {
    const cleanBody = this.xSSService.clean(user);
    const url = env.apiUrl + env.endpoints.user.account;

    return this.httpService.patch<Partial<User>, void>(url, cleanBody);
  }

  public checkAuthStatus() {
    const url = env.apiUrl + env.endpoints.auth.logStatus;
  
    return this.httpService.get(url);
  }

}
