import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {StudentsContComponent} from './teacher/students-cont.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './auth/login-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from './auth/auth.service';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  title = 'Virtual Labs';
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;
  studentsComponent: StudentsContComponent;
  private doLogin: Subscription;

  constructor(public dialog: MatDialog,  private authService: AuthService,
              private activatedRoute: ActivatedRoute, private router: Router){}

  ngOnInit() {
    this.doLogin = this.activatedRoute.queryParams.pipe(
      filter(params => params.doLogin)
    ).subscribe(params => {
      if (params.doLogin === 'true' && !this.authService.isUserLoggedIn()){
        this.openDialog();
      }else if (params.doLogin === 'false' && this.isUserLoggedIn()){
        this.authService.logout();
      }else{
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    this.doLogin.unsubscribe();
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }

  openDialog(): void {
    this.dialog.open(LoginDialogComponent, {
      width: '400px',
    });
    // console.log('open');
  }

  isUserLoggedIn(){
    return this.authService.isUserLoggedIn();
  }

  getButtonTitle(){
    return this.isUserLoggedIn() ? 'Logout' : 'Login';
  }

  authQueryParams() {
    let params;
    if (!this.authService.isUserLoggedIn()){
      params = {doLogin: true};
    }else{
      params = {doLogin: false};
    }
    return params;
  }

  getBadgeNumber(){
    if (this.studentsComponent === undefined) {
      return 0;
    }
    return this.studentsComponent.getSelectedStudents();
  }

  onActivate(componentReference: Component) {
    if (componentReference instanceof StudentsContComponent){
      this.studentsComponent = componentReference;
    }else {
      delete this.studentsComponent;
    }
  }
}


