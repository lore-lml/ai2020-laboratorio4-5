import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private router: Router,  private authService: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.authService.getUserDetails();
    if (user !== null){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.getJwt()}`
        }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {},
        (err: any) => {
        this.authService.logout();
      })
    );
  }
}
