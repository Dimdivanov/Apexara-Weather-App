import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { lastValueFrom, Subscription } from 'rxjs';

import { IpiButtonComponent } from '@ipi-soft/ng-components/button';
import { IpiDialogComponent } from '@ipi-soft/ng-components/dialog';
import { IpiInputComponent, IpiInputOptions } from '@ipi-soft/ng-components/input';

import { UserService } from './../../services/user.service';
import { RequestsAuthService } from './../../services/http/requests/requests-auth.service';

import { IpiSnackbarService } from '@ipi-soft/ng-components/snackbar';
import { Router } from '@angular/router';

interface FormControls {
  username: FormControl<string>,
  email: FormControl<string>,
}

interface FormControlsPassword {
  password: FormControl<string>,
  newPassword: FormControl<string>,
  repeatPassword: FormControl<string>,
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls:['./settings-page.component.css'],
  imports: [
    IpiInputComponent,
    IpiButtonComponent,
    IpiDialogComponent,
  ],
})

export class SettingsPageComponent implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private ipiSnackbarService: IpiSnackbarService,
    private requestsAuthService: RequestsAuthService) { 

      this.createForm();
      this.subscribeToFormChanges();
    }

  public formGroup!: FormGroup<FormControls>;
  public formGroupPassword!: FormGroup<FormControlsPassword>;
  
  public usernameOptions!: IpiInputOptions;
  public emailOptions!: IpiInputOptions;

  public password!: IpiInputOptions;
  public newPassword!: IpiInputOptions;
  public repeatPassword!: IpiInputOptions
  
  // dialog
  public shouldRender = signal<boolean>(false);

  private isWrongCredentials = false;
  private formChangeSubscription!: Subscription;

  private originalUsername = signal<string>('');
  private originalEmail = signal<string>('');

  public async ngOnInit(): Promise<void> {
    const user = await this.userService.checkUser();
    
    if (user?.data) {
      this.originalUsername.set(user.data.username);
      this.originalEmail.set(user.data.email);

      this.formGroup.patchValue({
        username: user.data.username,
        email: user.data.email,
      });
    }
  }
 
  public hasAccountInfoChanged(): boolean {
    const currentUsername = this.formGroup.controls.username.value.trim();
    const currentEmail = this.formGroup.controls.email.value.trim().toLowerCase();

    return (
      currentUsername !== this.originalUsername() || currentEmail !== this.originalEmail() 
    );
  }

  public async accountUpdate(): Promise<void> {
    if (this.formGroup.invalid || !this.hasAccountInfoChanged()) {
      return; 
    }
    
    if (this.formGroup.invalid) {
      Object.values(this.formGroup.controls).forEach(control => {
        control.markAllAsTouched();
        control.updateValueAndValidity();
      });

      return;
    }

    const user = await this.userService.checkUser();   
    
    if (!user?.data || !user.data.id) {      
      return;
    }

    const updatedUser = {
      id: user.data.id,
      username: this.formGroup.controls.username.value.trim(),
      email: this.formGroup.controls.email.value.toLowerCase().trim(),
    };

    if (user.data.username === updatedUser.username && user.data.email === updatedUser.email) {
      return;
    }

    const request = this.requestsAuthService.update(updatedUser);
    const response = await lastValueFrom(request);
    
    switch (response.status) {
      case 200:        
        this.ipiSnackbarService.open('Update successful');

        break;
      case 400:
        this.formGroup.controls.email.setErrors({ invalid: true });
        this.formGroup.controls.username.setErrors({ invalid: true });

        break;
    } 

    return;
  }

  public async passwordUpdate(): Promise<void> {
    if (this.formGroupPassword.invalid || this.formGroupPassword.value.password === this.formGroupPassword.value.newPassword) {      
      return;
    } 
    
    if (this.formGroupPassword.value.newPassword !== this.formGroupPassword.value.repeatPassword) {
      return this.formGroupPassword.controls.repeatPassword.setErrors({ invalid: true });
    }

    const user = await this.userService.checkUser();  

    const updatedPassword = {
      user,
      oldPassword: this.formGroupPassword.controls.password.value.trim(),
      newPassword: this.formGroupPassword.controls.newPassword.value.trim(),
    }

    const request = this.requestsAuthService.changePassword(updatedPassword);
    const response = await lastValueFrom(request);
    
    switch (response.status) {
      case 200:
        this.ipiSnackbarService.open('Password change successful');

        break;
      case 400:
        this.formGroupPassword.controls.newPassword.setErrors({ invalid: true });
        this.formGroupPassword.controls.repeatPassword.setErrors({ invalid: true });

        break;
    }

    return;
  }

  public async deleteAccount(): Promise<void> {
    const user = await this.userService.checkUser();
    
    const request = this.requestsAuthService.deleteUser(user.data.id);
    const response = await lastValueFrom(request);
    
    this.shouldRender.set(false);

    switch (response.status) {
      case 200:
        this.ipiSnackbarService.open('Account deleted');
        this.userService.logout();
        this.router.navigate([ '/dashboard' ]);

        break;
      case 400:
        this.ipiSnackbarService.open('Something unexpected happened');

        break;
    }
  }

  private createForm(): void {
    const formControls: FormControls = {
      username: this.fb.control('', { nonNullable: true, validators: [ Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9_]+$/) ] }),
      email: this.fb.control('', { nonNullable: true, validators: [ Validators.pattern(/^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ] }),
    };

    const formControlsPassword: FormControlsPassword = {
      password: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(6) ] }),
      newPassword: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(6) ] }),
      repeatPassword: this.fb.control('', { nonNullable: true, validators: [ Validators.required, Validators.minLength(6) ] }),
    }

    this.formGroup = this.fb.group(formControls);
    this.formGroupPassword = this.fb.group(formControlsPassword, {
      validators: this.passwordMatchValidator,
    });

    this.usernameOptions = {
      label: 'Username',
      type: 'name',
      formGroup: this.formGroup,
      formControlName: 'username',
      errors: {
        minLength: 'Username should be more than 2 characters',
        invalid: 'Wrong username',
      }
    }

    this.emailOptions = {
      label: 'Email',
      type: 'email',
      formGroup: this.formGroup,
      formControlName: 'email',
      errors: {
        pattern: 'Invalid format',
        invalid: 'Wrong email',
      }
    }

    this.password = {
      label: 'Password',
      type: 'password',
      formGroup: this.formGroupPassword,
      formControlName: 'password',
      errors: {
        minLength: 'Min 6 caracters',
        required: 'Password is required',
      }
    }

    this.newPassword = {
      label: 'New Password',
      type: 'password',
      formGroup: this.formGroupPassword,
      formControlName: 'newPassword',
      errors: {
        minLength: 'Min 6 caracters',
        invalid: 'Missmatch',
      }
    }

    this.repeatPassword = {
      label: 'Repeat Password',
      type: 'password',
      formGroup: this.formGroupPassword,
      formControlName: 'repeatPassword',
      errors: {
        minLength: 'Min 6 caracters',
        invalid: 'Missmatch',
      }
    }
  }

  private subscribeToFormChanges(): void {
    this.formChangeSubscription = this.formGroup.valueChanges.subscribe(() => {
      if (this.isWrongCredentials) {
        this.isWrongCredentials = false;
        this.formGroup.reset(this.formGroup.value);
        this.formGroup.markAllAsTouched();
      }
    });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const newPassword = control.get('newPassword');
    const repeatPassword = control.get('repeatPassword');

    if (!newPassword || !repeatPassword) return null;
    
    if (password?.value === newPassword.value) {
      newPassword.setErrors({ ...newPassword.errors, passwordsDoNotMatch: true })
    }

    if (newPassword.value !== repeatPassword.value) {
      repeatPassword.setErrors({ ...repeatPassword.errors, passwordsDoNotMatch: true});
    } else {
      const { passwordMatchValidator, ...others } = repeatPassword.errors || {};

      repeatPassword.setErrors(Object.keys(others).length ? others : null);
    }

    return null;
  }

  public ngOnDestroy(): void {
    if (this.formChangeSubscription) {
      this.formChangeSubscription.unsubscribe();
    }
  }

}
