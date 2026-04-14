import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Token } from '../servicios/token';

@Injectable({
  providedIn: 'root'
})
export class Roles {

  realRole: string = '';

  constructor(private tokenService: Token, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole: string[] = next.data['expectedRole'];
    this.realRole = this.tokenService.getRol();

    if (!this.tokenService.isLogged() || !expectedRole.some(r => this.realRole.includes(r))) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}

export const RolesGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(Roles).canActivate(next, state);
};