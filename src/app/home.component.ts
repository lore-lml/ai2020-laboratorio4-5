import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-home',
  template: '<h2 style="padding: 5px">{{getEmail()}}</h2>',
  styleUrls: []
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  getEmail(){
    if (this.authService.isUserLoggedIn()){
      return `Benvenuto ${this.authService.getUserDetails().getEmail()}`;
    }
    else{
      return 'Home';
    }
  }

}
