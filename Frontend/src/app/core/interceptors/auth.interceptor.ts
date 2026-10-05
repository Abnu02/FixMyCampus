import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[authInterceptor]', req.method, req.url, 'token:', token ? `${token.substring(0, 15)}...` : 'MISSING');

  const outgoing = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[authInterceptor Error]', req.url, 'Status:', error.status, error.message);
      if (error.status === 401) {
        authService.clearSession();
      }
      return throwError(() => error);
    })
  );
};
