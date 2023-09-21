import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AfterloginserviceService } from '../services/afterloginservice.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../services/authenticationservice.service';
@Injectable({
  providedIn: 'root'
})
export class ChecksuroleGuard implements CanActivate {
  constructor(private loginservice: AfterloginserviceService, private authservice: AuthenticationserviceService, private Router: Router, private cookieservice: CookieService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.loginservice.gettoken() != null || this.cookieservice.get('token') !== ''){

        // const role = route.data['roles'] as Array<any>;
        // if (role) {
          // const match = this.loginservice.rolematch(role);
          const getauthstatuss: boolean = this.loginservice.isSalesunit();

          if (getauthstatuss) {
            console.log('Salesunits role from authguard')
            // this.Router.navigate(['admin']);
            return true;
          }
        // }
      }else{
        // this.Router.navigate(['/']);
        this.authservice.authentication();
      }
      return false;
  }
  
}
