import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';
  private authenticatedUser: User;

  constructor(private http: HttpClient) {
    this.initAuthenticatedUser();
  }

  login(mail: string, psw: string){
    const json = {email: mail, password: psw};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(this.loginUrl, json, httpOptions)
      .pipe(
        catchError(() => of(null)),
        tap(authResult => this.initAuthenticatedUser(authResult.accessToken))
      );
  }

  logout(){
    delete this.authenticatedUser;
    localStorage.clear();
  }

  private initAuthenticatedUser(jwt: string = null){
    const token = localStorage.getItem('jwt');
    // Se non esiste un token nello storage e non ne è stato fornito uno nuovo non fare nulla
    if (token === null && jwt ===  null) {
      return;
    }
    // Se invece è presente solo nello storage inizializza lo user
    if (token !== null && jwt === null){
      jwt = token;
    } // Se ne è stato fornito uno allora si esegue lo store e si inizializza lo user
    else if (jwt !== null){
      localStorage.setItem('jwt', jwt);
    }
    this.authenticatedUser = new User(jwt);
  }

  getUserDetails(){
    return this.authenticatedUser === undefined ? null : this.authenticatedUser;
  }

  isUserLoggedIn(){
    return this.authenticatedUser !== undefined && !this.authenticatedUser.isTokenExpired();
  }
}
