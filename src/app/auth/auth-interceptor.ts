import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpEvent } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Api } from '../services/api';

// injects token into every request and can  refresh the token when expired
export const AuthInterceptorFn: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {

  const token = sessionStorage.getItem('access');
  const refresh = sessionStorage.getItem('refresh');
  const http = inject(HttpClient);
  const api = inject(Api);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refresh) {
        return http.post<{ access: string }>(`${api.baseurl}/token/refresh/`, {
          refresh
        }).pipe(
          switchMap((res) => {
            sessionStorage.setItem('access', res.access);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access}`
              }
            });
             return next(retryReq);
          }),
           catchError(() => {
            sessionStorage.removeItem('access');
            sessionStorage.removeItem('refresh');
            window.location.href = '/login';
            return throwError(() => new Error('Session expired'));
           })
        );
      }
      return throwError(() => error);
    })
  );
};
