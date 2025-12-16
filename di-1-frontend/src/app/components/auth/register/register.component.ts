import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { lastValueFrom, Subscription } from 'rxjs';

import { IpiInputComponent, IpiInputOptions } from '@ipi-soft/ng-components/input';
import { IpiButtonComponent } from '@ipi-soft/ng-components/button';
import { IpiSnackbarService } from '@ipi-soft/ng-components/snackbar';

import { UserService } from './../../../services/user.service';
import { RequestsAuthService } from './../../../services/http/requests/requests-auth.service';

interface FormControls {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    IpiInputComponent,
    IpiButtonComponent,
  ],
})

export class RegisterComponent implements OnDestroy {
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private ipiSnackbarService: IpiSnackbarService,
    private requestsAuthService: RequestsAuthService) {
    
    this.createForm();
    this.subscribeToFormChanges();
  }

  public registerForm!: FormGroup<FormControls>;

  public usernameOptions!: IpiInputOptions;
  public emailOptions!: IpiInputOptions;
  public passwordOptions!: IpiInputOptions;
  public repeatPasswordOptions!: IpiInputOptions;

  private isWrongCredentials = false;
  private formChangeSubscription!: Subscription;

  public async register(): Promise<void> {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched(); 
        control.updateValueAndValidity(); 
      });

      return;
    }

    const body = {
      username: this.registerForm.controls.username.value.trim(),
      email: this.registerForm.controls.email.value.toLowerCase().trim(),
      password: this.registerForm.controls.password.value.trim(),
      repeatPassword: this.registerForm.controls.repeatPassword.value.trim(),
    };
    
    const request = this.requestsAuthService.register(body);
    const response = await lastValueFrom(request);
    
    switch (response.status) {
      case 200:
        this.userService.isLoggedIn.set(true);
        this.ipiSnackbarService.open('Registration');
        this.router.navigate([ '/dashboard' ]);
        
        break;
      case 400:
        this.registerForm.controls.email.setErrors({ invalid: true });
        this.registerForm.controls.username.setErrors({ invalid: true});
        
        break;
    }

  }

  private createForm(): void {
    const formControls: FormControls = {
      username: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9_]+$/) ] }),
      email: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.pattern(/^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ] }),
      password: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(5) ] }),
      repeatPassword: this.fb.control('', { nonNullable: true, validators: [ Validators.required ] }),
    };

    this.registerForm = this.fb.group(formControls, {
      validators: this.passwordMatchValidator,
    });
    
    this.usernameOptions = {
      label: 'Username',
      placeholder: 'username',
      formGroup: this.registerForm,
      formControlName: 'username',
      errors: {
        required: 'Username is required',
        minlength: 'Username must be at least 2 characters',
      },
    };

    this.emailOptions = {
      label: 'Email',
      placeholder: 'email',
      formGroup: this.registerForm,
      formControlName: 'email',
      errors: {
        pattern: 'Invalid format',
        required: 'Email is required',
        invalid: 'Email is not valid',
      },
    };

    this.passwordOptions = {
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      formGroup: this.registerForm,
      formControlName: 'password',
      errors: {
        minlength: 'Password must be at least 5 characters',
        required: 'Password is required',
      },
    };

    this.repeatPasswordOptions = {
      label: 'Repeat Password',
      type: 'password',
      placeholder: 'Repeat password',
      formGroup: this.registerForm,
      formControlName: 'repeatPassword',
      errors: {
        required: 'Repeat password is required',
        passwordsDoNotMatch: 'Passwords do not match',
      },
    };
  }

  private subscribeToFormChanges(): void {
    this.formChangeSubscription = this.registerForm.valueChanges.subscribe(() => {
      if (this.isWrongCredentials) {
        this.isWrongCredentials = false;
        this.registerForm.reset(this.registerForm.value);
        this.registerForm.markAllAsTouched();
      }
    });
  }
  
private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (!password || !repeatPassword) return null;

  if (!password.value || !repeatPassword.value) return null;

  if (password.value !== repeatPassword.value) {
    repeatPassword.setErrors({ ...repeatPassword.errors, passwordsDoNotMatch: true });
  } else {
    const { passwordsDoNotMatch, ...others } = repeatPassword.errors || {};
    
    repeatPassword.setErrors(Object.keys(others).length ? others : null);
  }

  return null;
};


  public ngOnDestroy(): void {
    if (this.formChangeSubscription) {     
      this.formChangeSubscription.unsubscribe();
    }
  }

}
