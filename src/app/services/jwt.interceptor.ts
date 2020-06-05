import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = User.getUser();
    if (user !== null){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${User.getUser().getJwt()}`
        }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {},
        (err: any) => {
        User.logout();
        this.router.navigate(['/home']);
      })
    );
  }
}
