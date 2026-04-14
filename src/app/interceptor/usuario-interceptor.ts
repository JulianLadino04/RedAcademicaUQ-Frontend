import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Token } from '../servicios/token';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);

  const isApiAuth = req.url.includes('api/auth');
  const isApiPublico = req.url.includes('api/publico');

  if (!tokenService.isLogged() || isApiAuth || isApiPublico) {
    return next(req);
  }

  const token = tokenService.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};