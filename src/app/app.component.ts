import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {StudentsContComponent} from './teacher/students-cont.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Virtual Labs';
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  @ViewChild(StudentsContComponent)
  studentsComponent: StudentsContComponent;
  badgeNumber = 0;

  constructor(public dialog: MatDialog) {
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openDialog(): void {
    if (this.isUserLoggedIn()){
      User.logout();
      return;
    }

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    console.log('open');
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  isUserLoggedIn(){
    return User.isUserLoggedIn();
  }

  getButtonTitle(){
    return this.isUserLoggedIn() ? 'Logout' : 'Login';
  }
}


