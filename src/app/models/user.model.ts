import {OnInit} from '@angular/core';

interface JwtDetails {
  email: string;
  exp: number;
  iat: number;
  sub: string;
}
export class User{
  private static user: User;

  private jwt: string;
  private details: JwtDetails;

  private static init(){
    const jwt = localStorage.getItem('jwt');
    if (jwt == null) {
      return;
    }

    if (this.user === undefined) {
      this.user = new User(jwt);
    }
  }
  static getUser(){
    this.init();
    return this.user === undefined ? null : this.user;
  }

  static login(jwt: string){
    localStorage.setItem('jwt', jwt);
  }

  static isUserLoggedIn(){
    this.init();
    return this.user !== undefined && !this.user.isTokenExpired();
  }

  static logout(){
    delete this.user;
    localStorage.removeItem('jwt');
  }

  private constructor(jwt: string) {
    this.jwt = jwt;
    const json = JSON.parse(atob(jwt.split('.')[1]));
    this.details = {
      email: json.email,
      exp: json.exp,
      iat: json.iat,
      sub: json.sub
    };
  }

  isTokenExpired(){
    return Date.now() >= this.details.exp * 1000;
  }

  getEmail(){
    return this.details.email;
  }

  getTokenExpirationDate(){
    const date = new Date(this.details.exp * 1000);
    date.setUTCHours(15);
    return date;
  }

  getTokenDuration(){
    return this.details.exp - this.details.iat;
  }

  getTokenGenerationDate(){
    const date = new Date(this.details.iat * 1000);
    date.setUTCHours(15);
    return date;
  }

  getJwt(){
    return this.jwt;
  }
}
