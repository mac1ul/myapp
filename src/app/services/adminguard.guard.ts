import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationserviceService } from '../services/authenticationservice.service';
@Injectable({
  providedIn: 'root'
})
export class AdminguardGuard implements CanActivate {
  constructor(private authservice: AuthenticationserviceService, private Router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuth = localStorage.getItem('sso_token');
    console.log(isAuth)
    if (this.authservice.gettoken() != null || isAuth != null) {
      // const role = route.data['roles'] as Array<any>;
      const getauthstatuss = this.authservice.getauthstatus();
      if( isAuth != null){
        console.log('forcefully true');
        return true;
      }
      if (getauthstatuss) {
        console.log('Redirect to the login page');
        // const match = this.authservice.rolematch(role);
        // const admin: boolean = this.authservice.Identifyadmin();
        return true;
      }
    }
    return false;
  }

}
