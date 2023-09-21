import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
declare var $: any;
@Component({
  selector: 'app-admin-prototype',
  templateUrl: './admin-prototype.component.html',
  styleUrls: ['./admin-prototype.component.scss']
})
export class AdminPrototypeComponent implements OnInit {
  check: any = {}; // for check
  checked = true; //check slected or not
  projectinformation: any;
  materiallist: any;
  sp_company_name: any;
  salesunit_id: any;
  fasttrack_name: any;
  fasttrack_body: any;
  alert: boolean = false;
  toggleBool: boolean = false;
  message: string = "";
  contact_person: any;
  selected_fasttrack_id: any;
  email_address: any;
  mail: any= FormGroup;
  fasttrack_closed_request: any;
  fasttrack_closed_results: any = [];
  first_check: any;
  last_check: boolean = false;
  first_raw: boolean = true;
  counter: number = 1;
  check_status: boolean = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient ) { }

  ngOnInit(): void {
    this.fasttrack_closed_results.length = 0;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/administrator_fasttrack_main.php").subscribe((res: any) =>{
      this.fasttrack_name = res;
      this.fasttrack_name.forEach((element: any) => {
        const fasttrack_id: any = element.fasttrack_id;
        const customer_name: any = element.customer_name;
        const status: any = element.status;
        const fasttrack_date: any = element.fasttrack_date;
        if(this.counter == 1){
          this.check_status = true;
          this.showfulldata(element.fasttrack_id);
        }else{
          this.check_status = false;
        }
        this.counter = this.counter + 1;
        this.fasttrack_closed_results.push({
          'fasttrack_id' : fasttrack_id,
          'customer_name' : customer_name,
          'status' : status,
          'fasttrack_date' : fasttrack_date,
          'check_status' : this.check_status
        });
        // console.log(this.fasttrack_closed_results);
      });
    });
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/administrator_get_ftsolved.php").subscribe((res: any) =>{
      this.fasttrack_closed_request = res;
    });
    this.mail = this.formBuilder.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
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
    // alert(selected)
    this.alert = true;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/administrator_fasttrack_body.php?fasttrack_id="+selected).subscribe((res: any) =>{
      this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
    });
  }
  uncheckOther(chk: any, event: any) {
    if (event) {
      //uncheck all checkbox
      this.fasttrack_closed_results.forEach((x: any) => {
        if (x.check_status == true)
          x.check_status = false;
      })
      //check the selected
      if (chk.check_status == true) {
        chk.check_status = false;
      } else {
        chk.check_status = true;
      }
    }
    else {
      console.log('Call Both API')
    }
  }
  uncheckOthers(chk: any, event: any){
    if (event) {
      // this.first_raw = false;
      // this.first_check = 0;
      //uncheck all checkbox
      this.fasttrack_closed_request.forEach((x: any) => {
        if (x.checked == true)
          x.checked = false;
          // this.first_raw = true;
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
  sendReply(fid: any, contact_person: any){
    this.contact_person = contact_person;
    this.selected_fasttrack_id = fid;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/administrator_solvedreq.php?fasttrack_id="+fid).subscribe((res: any) =>{
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
    // $('#messagebox').moduleModal('open');
  }
  modalClose2(){
    $('#3dmodels').moduleModal('close');
  }
  replayModel(){
    $('#messagebox').moduleModal('close');
    $('#3dmodels').moduleModal('open');
  }
}
