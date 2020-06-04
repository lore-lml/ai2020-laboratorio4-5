import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrls: ['login-dialog.component.css']
})
export class LoginDialogComponent {

  email: FormControl;
  password: FormControl;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(255)]);
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
}
