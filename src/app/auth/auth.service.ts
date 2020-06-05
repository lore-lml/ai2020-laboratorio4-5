import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

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
        map(authResult => authResult.accessToken)
      );
  }
}
