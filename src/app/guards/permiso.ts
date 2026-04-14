import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from
'@angular/router';
import { Token } from '../servicios/token';

@Injectable({
  providedIn: 'root',
})
export class Permiso {
  constructor(private tokenService: Token, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
if (this.tokenService.isLogged()) {
this.router.navigate([""]);
return false;
}
return true;
}
}
export const LoginGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state:
RouterStateSnapshot): boolean => {
return inject(Permiso).canActivate(next, state);
}

