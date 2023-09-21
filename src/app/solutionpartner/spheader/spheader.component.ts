import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
@Component({
  selector: 'app-spheader',
  templateUrl: './spheader.component.html',
  styleUrls: ['./spheader.component.scss']
})
export class SpheaderComponent implements OnInit {

  constructor(private cookieservice: CookieService, private Router: Router, private http: HttpClient, private authservice: AuthenticationserviceService) { }

  ngOnInit(): void {
  }

  logout(){
    localStorage.removeItem('Token');
    this.cookieservice.deleteAll();
    this.Router.navigate(['/login']);
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
    //   console.log('logout from solution partner');
    // });
    // localStorage.clear();
    // this.cookieservice.deleteAll();
    // sessionStorage.clear();
    // setTimeout(()=>{
    //   window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/2022/SPM/v3/live";
    // },200)
    // this.authservice.authentication();
  }
}
