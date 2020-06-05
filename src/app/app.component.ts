import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {StudentsContComponent} from './teacher/students-cont.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {User} from './models/user.model';
import {Router} from '@angular/router';

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

  constructor(public dialog: MatDialog, private router: Router) {
    if (User.isUserLoggedIn()){
      router.navigate(['/teacher', 'course', 'applicazioni-internet', 'students']);
    }
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openDialog(): void {
    if (this.isUserLoggedIn()){
      User.logout();
      this.router.navigate(['/home']);
      return;
    }

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    console.log('open');
    dialogRef.afterClosed().subscribe(result => {
      // DO SOMETHING WHEN DIALOG CLOSE
    });
  }

  isUserLoggedIn(){
    return User.isUserLoggedIn();
  }

  getButtonTitle(){
    return this.isUserLoggedIn() ? 'Logout' : 'Login';
  }
}


