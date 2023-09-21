import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
// import { AuthenticationserviceService } from './authenticationservice.service';
import { AuthenticationserviceService } from './services/authenticationservice.service';
import { AfterloginserviceService } from './services/afterloginservice.service';
// import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Keepalive } from '@ng-idle/keepalive';


declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'my-first-project';
  home: boolean = false;
  // roles: any;
  // role: any;

  // Timer
  // time = new Date();
  // rxTime = new Date();
  // intervalId;
  // subscription: Subscription;

  // Autologout
  // idleState = 'NOT STARTED';
  // countdown?: number = undefined;
  // lastPing?: Date = undefined;

  constructor() {
    // const isAuth = localStorage.getItem('sso_token');
    // const getauth = this.RequestLogin.getauthstatus();
    // const afterlogintoken: any = localStorage.getItem('Token');

    // if (isAuth === null) {
    //   // alert("SSO Call")
    //   this.RequestLogin.authentication();
    // } else {
    //   this.router.navigate(['/login']);
    // }

    // if (afterlogintoken === null) {
    //   this.router.navigate(['/login']);
    //   // this.RequestLogin.authentication()
    //   this.home = true;
    // } else {
    //   this.login.userdata().forEach((element: any) => {
    //     this.roles = element.role;
    //     if (this.roles === 'ADMIN') {
    //       this.router.navigate(['/admin']);
    //     } else if (this.roles === 'Sales_Unit') {
    //       this.router.navigate(['/SalesUnitDashboard']);
    //     } else if (this.roles === 'Solution_Partner') {
    //       this.router.navigate(['/SPDashboard']);
    //     }
    //   });
    // }

    // this.login.userdata().forEach((element: any) => {
    //   this.role = element.role;
    //   if (this.role == 'ADMIN') {
    //     this.login.redirectto();
    //   } else if (this.role == 'Sales_Unit') {
    //     this.login.redirecttosalesunit();
    //   } else if (this.role == 'Solution_Partner') {
    //     this.login.redirecttosolution();
    //   }
    // });

    // this.intervalId = setInterval(() => {
    //   this.time = new Date();
    // }, 1000);

    // Using RxJS Timer
    // this.subscription = timer(0, 1000)
    //   .pipe(
    //     map(() => new Date()),
    //     share()
    //   )
    //   .subscribe((time) => {
    //     let hour = this.rxTime.getHours();
    //     let minuts = this.rxTime.getMinutes();
    //     let seconds = this.rxTime.getSeconds();
    //     //let a = time.toLocaleString('en-US', { hour: 'numeric', hour12: true });
    //     let NewTime = hour + ':' + minuts + ':' + seconds;
    //     // console.log(NewTime);
    //     this.rxTime = time;
    //     if (NewTime === '23:59:55') {
    //       // call logout
    //       this.http
    //         .get<any>(
    //           'https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php'
    //         )
    //         .subscribe((res: any) => {
    //           console.log('logout from Admin');
    //         });
    //       localStorage.clear();
    //       this.cookieservice.deleteAll();
    //       sessionStorage.clear();
    //       setTimeout(() => {
    //         window.location.href =
    //           'https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/2022/SPM/v3/test_version';
    //       }, 200);
    //     }
    //   });

    // Autologout

    // set idle parameters
    // idle.setIdle(1500); // how long can they be inactive before considered idle, in seconds
    // idle.setTimeout(300); // how long can they be idle before considered timed out, in seconds
    // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    // idle.onIdleStart.subscribe(() => {
    //   this.idleState = 'IDLE';
    //   this.deletemodelopen();
    //   // open model
    // });
    // do something when the user is no longer idle
    // idle.onIdleEnd.subscribe(() => {
    //   this.idleState = 'NOT_IDLE';
    //   console.log(`${this.idleState} ${new Date()}`);
    //   this.countdown = undefined;
    //   cd.detectChanges(); // how do i avoid this kludge?
    //   //  Close Model
    //   this.deletemodelclose();
    // });
    // do something when the user has timed out
    // idle.onTimeout.subscribe(() => {
    //   this.idleState = 'TIMED_OUT';
    //   //  logout
    //   this.deletemodelclose();
    //   localStorage.removeItem('Token');
    //   this.cookieservice.deleteAll();
    //   this.router.navigate(['/login']);
    // });
    // // do something as the timeout countdown does its thing
    // idle.onTimeoutWarning.subscribe((seconds) => {
    //   this.countdown = seconds;
    //   this.deletemodelopen();
    // });

    // // set keepalive parameters, omit if not using keepalive
    // keepalive.interval(15); // will ping at this interval while not idle, in seconds
    // keepalive.onPing.subscribe(() => (this.lastPing = new Date())); // do something when it pings
  }

  // ngOnInit() {
  //   this.reset();
  // }

  // deletemodelopen() {
  //   $('#opendeletemodel').moduleModal('open');
  // }

  // deletemodelclose() {
  //   $('#opendeletemodel').moduleModal('close');
  // }
  // Auto_logout(){
  //   this.deletemodelclose();
  //   localStorage.removeItem('Token');
  //   this.cookieservice.deleteAll();
  //   this.router.navigate(['/login']);
  // }
  // reset() {
  //   // we'll call this method when we want to start/reset the idle process
  //   // reset any component state and be sure to call idle.watch()
  //   this.idle.watch();
  //   this.idleState = 'NOT_IDLE';
  //   this.countdown = undefined;
  //   this.lastPing = undefined;
  //   this.deletemodelclose();
  // }

  // resettimer() {
  //   this.reset();
  // }

  // ngOnDestroy() {
  //   clearInterval(this.intervalId);
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  // }


}
