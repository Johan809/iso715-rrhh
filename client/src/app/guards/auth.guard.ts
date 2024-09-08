import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { ToastManager } from '@blocks/toast/toast.manager';
import { RoleLevel } from '@enums/role-level.enum';
import { StorageHelper } from '@helpers/storage.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private toast: ToastManager) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredLevel = route.data['requiredLevel'];
    const userLevel = StorageHelper.getUserInfo()?.role ?? RoleLevel.NOT_LOGGED;

    if (userLevel >= requiredLevel) {
      return true;
    }

    if (userLevel === RoleLevel.NOT_LOGGED)
      this.router.navigate(['/auth/login']);
    else this.toast.quickShow('Este usuario no tiene permiso', 'warning', true);

    return false;
  }
}
