import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit{

  email: FormControl;
  password: FormControl;
  loginError: boolean;
  private onDialogClose: Subscription;
  loginErrorMsg: string;

  constructor(private dialogRef: MatDialogRef<LoginDialogComponent>, private authService: AuthService, private router: Router) {
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(255)]);
    this.loginErrorMsg = '';
  }

  ngOnInit() {
    this.onDialogClose = this.dialogRef.afterClosed()
      .subscribe(result => {
        let redirectRoute = this.authService.getAndDeletePendingRoute();
        if (redirectRoute === null || redirectRoute === undefined || !this.authService.isUserLoggedIn()){
          redirectRoute = '/home';
        }
        this.router.navigate([redirectRoute]);
        this.onDialogClose.unsubscribe();
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getEmailErrors() {
    if (this.email.hasError('required')) {
      return 'Il campo Email non può essere vuoto';
    }else if (this.email.hasError('email')){
      return 'Email non valida';
    }

    return this.email.hasError('maxLength') ?  'Il campo Email non può contenere più di 255 caratteri' : '';
  }

  getPasswordErrors() {
    if (this.password.hasError('required')) {
      return 'Il campo Password non può essere vuoto';
    }

    return this.email.hasError('maxLength') ? 'Il campo Password non può contenere più di 255 caratteri' : '';
  }

  submit() {
    this.loginError = false;
    if (this.getEmailErrors() !== '' || this.getPasswordErrors() !== ''){
      this.email.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    this.authService.login(this.email.value, this.password.value).pipe(first())
      .subscribe((result) => {
        if (!result.hasOwnProperty('status')){
          this.onNoClick();
          return;
        }
        if (result.status >= 500){
          this.loginErrorMsg = 'Qualcosa è andato storto, riprova più tardi';
        }else{
          this.loginErrorMsg = 'Email o password errati';
        }
        this.loginError = true;
        });
  }
}
