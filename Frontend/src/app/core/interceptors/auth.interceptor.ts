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
      // Do NOT call clearSession() here — let each component/guard handle 401s.
      // Calling clearSession() destroys the session and navigates away, which
      // prevents components from showing the actual error to the user.
      return throwError(() => error);
    })
  );
};
