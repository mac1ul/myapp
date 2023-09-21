import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
declare var $: any;
@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent implements OnInit {
  token: any;
  constructor(private http: HttpClient, private Router: Router, private cookieservice: CookieService, private authservice: AuthenticationserviceService) {
    this.token = localStorage.getItem('sso_token');
  }

  ngOnInit(): void {
     // $('.module-header').moduleHeader();
     $('.module-header-user-menu').moduleHeaderUserMenu();
     $('.module-header-navigation').moduleHeaderNavigation();
     // If not yet covered by the regular modal initialisation:
     $('.modal-language-select').moduleModal();
     $('.header-extensions .module-header-search').moduleHeaderSearch();
     $('.module-header-meta-navigation').moduleHeaderMetaNavigation();
  }

  logout(){
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
    //   console.log('logout from Admin');
    // });
    localStorage.removeItem('Token');
    this.cookieservice.deleteAll();
    this.Router.navigate(['/login']);
    // sessionStorage.clear();
    // setTimeout(()=>{
    //   window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/2022/SPM/v3/live";
    // },200)
    // this.authservice.authentication();
  }
}
