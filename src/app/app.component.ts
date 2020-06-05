import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {StudentsContComponent} from './teacher/students-cont.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {Router} from '@angular/router';
import {AuthService} from './auth/auth.service';

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

  constructor(public dialog: MatDialog, private router: Router,  private authService: AuthService) {}

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openDialog(): void {
    if (this.isUserLoggedIn()){
      this.authService.logout();
      this.router.navigate(['/home']);
      return;
    }

    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    // console.log('open');
    dialogRef.afterClosed().subscribe(result => {
      // DO SOMETHING WHEN DIALOG CLOSE
    });
  }

  isUserLoggedIn(){
    return this.authService.isUserLoggedIn();
  }

  getButtonTitle(){
    return this.isUserLoggedIn() ? 'Logout' : 'Login';
  }
}


