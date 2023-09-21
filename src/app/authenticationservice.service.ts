import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jwt_decode from "jwt-decode";
import { AuthResponsemodel } from '../app/auth-responsemodel';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationserviceService {
  token: any;
  constructor(private httpClient: HttpClient, private router: Router, @Inject(DOCUMENT) private document: Document, private cookieservice: CookieService) { }
  authentication(){
    this.httpClient.get<AuthResponsemodel>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/user.php").subscribe((res: AuthResponsemodel) =>{
      
      if (res.data !== null){
        this.token = res.data;
        this.cookieservice.set("tokens", this.token);
        console.log(res.data);
        let decoded: any = jwt_decode(res.data);
        // let roles: any = decoded['resource_access']['dc-mh-hosting']['roles'];
        let email: string = decoded['email'];
        let family_name: string = decoded['family_name'];
        let given_name: string = decoded['given_name'];
        console.log(email);

        this.httpClient.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/userlist.php", {email: email}).subscribe((res: any) =>{
          if(res.okay == true){
            this.router.navigate(['/login']);
          }else{
            alert(res.message);
          }
        });
        // Save token into cookie
        return this.token;
      }
      else
      {
        this.GotoLogin();
      }
    });
  }
  GotoLogin(){
    this.document.location.href  = 'https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/SSOLoginRequest.php';
  }
  gettoken(){
    return this.token;
  }
}