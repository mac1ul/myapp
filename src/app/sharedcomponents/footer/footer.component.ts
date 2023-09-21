import { Component, OnInit } from '@angular/core';
import rexrothCookieManagerConfig_p from '../../../assets/cookie-setting/d-system/de-en.json'
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private rexrothCookieManagerUrl = 'https://dc-mkt-prod.cloud.bosch.tech/xrm/media/cookie_manager_v2_6_0/bosch-privacy-settings-v2-min-js.js?ver=1621317778097';
  private rexrothCookieManagerStyleUrl = 'https://dc-mkt-prod.cloud.bosch.tech/xrm/media/cookie_manager_v2_6_0/bosch-privacy-settings-v2-min-css.css?ver=1621317778097';
  constructor() { }

  ngOnInit(): void {
    // this.setRexrothCookieManager();

    $('.module-back-to-top').moduleBackToTop();
  }

  private setRexrothCookieManager(){
    this.loadRexrothCookieManagerStyle();
    this.loadRexrothCookieManagerConfig();
    this.loadRexrothCookieManager();
  }

  private loadRexrothCookieManagerStyle(){
    const head = <HTMLElement> document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = this.rexrothCookieManagerStyleUrl;
    head.appendChild(link)
  }

  private loadRexrothCookieManagerConfig() {
    // console.log("config")
    // console.log(rexrothCookieManagerConfig)

    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = JSON.stringify(rexrothCookieManagerConfig_p);
    script.type= 'application/json',
    script.id = 'bosch-privacy-settings-v2-config',
    body.appendChild(script);
  }

  private loadRexrothCookieManager(){
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = this.rexrothCookieManagerUrl;
    body.appendChild(script);

  }
}
