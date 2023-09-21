import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import jwt_decode from "jwt-decode";
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from './response';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationserviceService {
  authorization: boolean = false;
  adminauthentication: boolean = false;
  cuauthenrication: boolean = false;
  spauthenrication: boolean = false;
  token: string = '';
  isMatch: boolean = false;
  roles: any;
  allowesRoles: any = ['spm_admin', 'spm_salesunit', 'spm_partner'];
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) private document: Document,) { }

  authentication() {
    this.httpClient.get<Response>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/user.php").subscribe((res: Response) => {
      if (res.data !== null) {
        this.authorization = true;
        this.token = res.data;
        localStorage.setItem('sso_token', this.token);
        console.log(res.data);
        let decoded: any = jwt_decode(res.data);
        // let roles: any = decoded['resource_access']['dc-mh-hosting']['roles'];
        let email: any = decoded['email'];
        let family_name = decoded['family_name'];
        let given_name = decoded['given_name'];

        // if (roles.includes('spm_admin') || roles.includes('spm_salesunit') || roles.includes('spm_partner')) {
          this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/verifyallusers.php?email=" + email).subscribe((res: any) => {
            console.log(res);
            if (res === true) {
              // this.authorization = res;
              this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/LoginPIN.php?email=" + email).subscribe((res: any) => {
              });
              if (this.authorization === true) {

                this.adminauthentication = true;
                this.router.navigate(['/login']);
              }
              else {
                this.adminauthentication = false;
                this.router.navigate(['/RequestUser']);
              }
            }
            else {
              this.adminauthentication = false;
              this.router.navigate(['/RequestUser']);
            }
          });
        // }
        // else if (roles.includes('spm_salesunit')) {
        //   this.httpClient.get<any>("https://mobilehydraulics.boschrexroth.com/Akshay_SSO/php/auth/verifysalesunits.php?email=" + email).subscribe((res: any) => {
        //     if (res === true) {
        //       this.authorization = res;
        //       if (this.authorization === true) {
        //         this.cuauthenrication = true;
        //         this.router.navigate(['/login']);
        //       }
        //       else {
        //         this.cuauthenrication = false;
        //         this.router.navigate(['/forbidden']);
        //       }
        //     }
        //   });

        // } else if (roles.includes('spm_partner')) {
        //   this.httpClient.get<any>("https://mobilehydraulics.boschrexroth.com/Akshay_SSO/php/auth/verifyusersolutionpartner.php?email=" + email).subscribe((res: any) => {
        //     if (res === true) {
        //       this.authorization = res;
        //       if (this.authorization === true) {
        //         this.spauthenrication = true;
        //         this.router.navigate(['/login']);
        //       }
        //       else {
        //         this.spauthenrication = false;
        //         // this.router.navigate(['/forbidden']);
        //       }
        //     }
        //   });
        // }
        // else {
          // alert("Role is not found");
          // this.authorization = false;
          // this.router.navigate(['/forbidden']);
        // }
      } else {
        this.goToSSO();
      }
    });
    return this.authorization, this.token;
  }
  goToSSO() {
    this.document.location.href  = 'https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/rexroth_login.php';
  }
  gettoken() {
    return this.token;
  }

  public rolematch(role: any): any {
    let tokens: any = this.gettoken();
    let decoded: any = jwt_decode(tokens);
    this.roles = decoded['resource_access']['dc-mh-hosting']['roles'];
    if (this.roles != null) {

      for (let i = 0; i <= this.roles.length; i++) {
        for (let j = 0; j <= role.length; j++) {
          if (this.roles[i] == role[j]) {
            console.log('Role Is Available');
            return this.isMatch = true;
          }
          else {
            console.log('not match');
            this.isMatch = false;
          }
        }
      }
    } else {
      return this.isMatch = false;
    }
    return this.isMatch;
  }

  Identifyadmin(){
    return this.adminauthentication;
  }

  getauthstatus(){
    return this.authorization;
  }
}
