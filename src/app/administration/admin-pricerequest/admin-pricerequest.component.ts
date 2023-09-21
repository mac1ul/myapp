import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-admin-pricerequest',
  templateUrl: './admin-pricerequest.component.html',
  styleUrls: ['./admin-pricerequest.component.scss']
})
export class AdminPricerequestComponent implements OnInit {
  check: any = {}; // for check
  checked = true; //check slected or not
  projectinformation: any;
  materiallist: any;
  sp_company_name: any;
  salesunit_id: any;
  fasttrack_name: any;
  closed_price_req: any = [];
  fasttrack_body: any;
  alert: boolean = false;
  selected_pricerequest_id: any;
  message: any;
  price_closed_request: any;
  counter: number = 1;
  check_status: boolean = false;
  constructor( private http: HttpClient) { }

  ngOnInit(): void {
    this.closed_price_req.length = 0;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/administrator_price_main.php").subscribe((res: any) =>{
      this.fasttrack_name = res;
      this.fasttrack_name.forEach((element: any) => {
        const price_request_id: any = element.price_request_id;
        const customer_partner_name: any = element.customer_partner_name;
        const status: any = element.status;
        if(this.counter == 1){
          this.check_status = true;
          this.showfulldata(element.price_request_id);
        }else{
          this.check_status = false;
        }
        const price_req_date: any = element.price_req_date;
        this.counter = this.counter + 1;
        this.closed_price_req.push({
          'price_request_id' : price_request_id,
          'customer_partner_name' : customer_partner_name,
          'status' : status,
          'checked' : this.check_status,
          'price_req_date' : price_req_date
        });
      });
    });

    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/administrator_get_prsolved.php").subscribe((res: any) =>{
      this.price_closed_request = res;
      // console.log(this.fasttrack_name)
    });

    $('.module-accordion').moduleAccordion();
  }
  showfulldata(selected: any){
     //Logic for button disbaled or enabled if selected
     if (this.check[selected]) {
      this.check[selected] = !this.check[selected];
      this.checked = true;
    }
    else {
      this.check = {}
      this.check[selected] = true;
      this.checked = false;
    }
    console.log(this.checked);
    this.alert = true;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/administrator_price_body.php?fasttrack_id="+selected).subscribe((res: any) =>{
      this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
    });
  }
  uncheckOther(chk: any, event: any) {
    if (event) {
      //uncheck all checkbox
      this.closed_price_req.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //check the selected
      if (chk.checked == true) {
        chk.checked = false;
      } else {
        chk.checked = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  uncheckOthers(chk: any, event: any){
    if (event) {
      //uncheck all checkbox
      this.price_closed_request.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
      })
      //check the selected
      if (chk.checked == true) {
        chk.checked = false;
      } else {
        chk.checked = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  deletemodelclose(){
    $('#messagebox').moduleModal('close');
    this.ngOnInit();
  }
  sendReply(pid: any){
    this.selected_pricerequest_id = pid;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/administrator_solvedpricereq.php?price_request_id="+pid).subscribe((res: any) =>{
      // this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
      if(res.ok === true){
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }else{
        $('#messagebox').moduleModal('open');
        this.message = res.message;
      }
    });
  }
}
