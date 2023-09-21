import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Salesunit } from '../../administration/models/salesunit';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
declare var $: any;
@Component({
  selector: 'app-su-addsolutionpartner',
  templateUrl: './su-addsolutionpartner.component.html',
  styleUrls: ['./su-addsolutionpartner.component.scss']
})
export class SuAddsolutionpartnerComponent implements OnInit {
  addspuser: any = FormGroup;
  salesunit_id: any;
  Allempdata: any;
  getsolutionpartnername: any;
  getsolutionpartnerID: any;
  disabledinput: boolean = false;
  partnername: any;
  partnerid: any;
  constructor(private getdata: AfterloginserviceService, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) { 
    this.getdata.userdata().forEach(element => {
      this.salesunit_id = element.userID;
    });
    // console.log(this.salesunit_id)
  }

  ngOnInit(): void {
    this.http.get<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetAllSolutionPartner.php?country_unitid="+this.salesunit_id).subscribe((res: Salesunit) =>{
      this.Allempdata = res;
    });
    this.addspuser = this.formBuilder.group({
      solutionpartnername: ['', Validators.required],
      partnerid: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      SalesunitId: this.salesunit_id
    });

    $('.module-search').moduleSearch();
    $('.module-pagination').modulePagination();
  }
  // fillpartname(name: any){
  //   if(name.length > 4 && name !== ""){
  //     this.http.get<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Salesunit_GetPartnerNameandId.php?name="+name).subscribe((res: Salesunit) =>{
  //       this.getsolutionpartnername = res;
  //       console.log(this.getsolutionpartnername)
  //       if(this.getsolutionpartnername !== null){
  //         this.disabledinput = true;
  //         this.http.get<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Salesunit_GetPartnerId.php?name="+this.getsolutionpartnername).subscribe((res: Salesunit) =>{
  //           this.getsolutionpartnerID = res;
  //           console.log(this.getsolutionpartnerID)
  //         });
  //       }
  //   });
  //   }
  // }
  fillname(e: any){
    if(e.length > 4 && e !== ""){
      this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getpartnerdetailsbysearch.php?name="+e).subscribe((res: any) =>{
        this.partnername = res;
      });
    }
  }
  fillnumber(sp_registered_id: any){
    this.partnername.forEach((element: any) => {
      if(element.partner_company_name == sp_registered_id){
        this.partnerid = element.solutionpartner_registered_id;
      }
    });
  }
  AddSolutionPartner(){
    this.http.post<Salesunit>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/addsolutionpartner.php", this.addspuser.value).subscribe((res: Salesunit) => {
      if(res.ok === true){
        alert(res.message)
        this.addspuser.reset()
        this.ngOnInit()
      }  
      else{
        alert(res.message)
      }
    });
  }
}
