import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { lastValueFrom } from 'rxjs';

import { IpiButtonComponent } from '@ipi-soft/ng-components/button';
import { IpiInputComponent, IpiInputOptions } from '@ipi-soft/ng-components/input';

import { UserService } from './../../../services/user.service';
import { RequestsAuthService } from './../../../services/http/requests/requests-auth.service';

interface FormControls {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    IpiInputComponent,
    IpiButtonComponent,
  ],
})

export class LoginComponent { 

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private requestsAuthService: RequestsAuthService) {
      
    this.createForm();
  }

  public loginForm!: FormGroup<FormControls>;

  public emailOptions!: IpiInputOptions;
  public passwordOptions!: IpiInputOptions;

  public async login(): Promise<void> {
    if (this.loginForm.invalid) {
       Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched(); 
        control.updateValueAndValidity(); 
      });

      return;
    }

    const body = {
      email: this.loginForm.controls.email.value.toLowerCase().trim(),
      password: this.loginForm.controls.password.value.trim(),
    };

    const request = this.requestsAuthService.login(body);
    const response = await lastValueFrom(request);

    switch (response.status) {
      case 200:
        this.userService.isLoggedIn.set(true);
                     
        this.router.navigate([ '/dashboard' ]);

        break;
      case 404:
        this.loginForm.controls.email.setErrors({ invalid: true });
        
        this.loginForm.controls.password.setErrors({ invalid: true });

        break;
    }
  }

  private createForm(): void {
    const formControls: FormControls = {
      email: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.pattern(/^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ] }),
      password: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(5) ] }),
    };

    this.loginForm = this.fb.group(formControls);

    this.emailOptions = {
      label: 'Email',
      placeholder: 'example@gmail.com',
      formGroup: this.loginForm,
      formControlName: 'email',
      errors: {
        required: 'Email is required',
        pattern: 'Invalid format',
        invalid: 'Wrong email or password',
      },
    };

    this.passwordOptions = {
      label: 'Password',
      type: 'password',
      formGroup: this.loginForm,
      formControlName: 'password',
      errors: {
        required: 'Password is required',
        invalid: 'Wrong email or password',
      },
    };
  }

}
