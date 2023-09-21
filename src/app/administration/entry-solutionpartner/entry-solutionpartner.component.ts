import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Solutionpartner } from '../models/solutionpartner';
declare var $: any;
@Component({
  selector: 'app-entry-solutionpartner',
  templateUrl: './entry-solutionpartner.component.html',
  styleUrls: ['./entry-solutionpartner.component.scss']
})
export class EntrySolutionpartnerComponent implements OnInit {
  addPartnerForm: any = FormGroup;
  solution_partner: any=[];
  country: any;
  partnername: any;
  partnerid: any;
  generateuniqueid: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  search: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/Getsolution_partner.php").subscribe((res: any) =>{
      this.solution_partner = res;
    });

    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/getallsalesunitdetails.php").subscribe((res: any) =>{
      this.country = res;
    });

    $('.module-search').moduleSearch();
    $('.module-pagination').modulePagination();

    this.addPartnerForm = this.formBuilder.group({
      partnername: ['', Validators.required],
      partnerID: ['', Validators.required],
      country: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
  });
  }
  generateid(salesunitname: any){
    const cut: any = salesunitname.substring(1,6);
    const unique: any = '__' + Math.random().toString(36).substr(2, 10);
    this.partnerid = cut + unique;
  }
  fillname(e: any){
    if(e.length > 4 && e !== ""){
      this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/getpartnerdetailsbysearch.php?name="+e).subscribe((res: any) =>{
        this.partnername = res;
        // console.log(res);
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
  OnSubmitPartner(){
    // console.log(this.addPartnerForm.value);
    this.httpClient.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/InsertPartnerSuperUser.php", {data: this.addPartnerForm.value}).subscribe((res : Solutionpartner) =>{
        if(res.ok === true){
          alert(res.message);
          // this.ngOnInit()
          // this.addPartnerForm.reset();
        }else{
          alert(res.message)
        }
    });
  }

  OnClearSPFormData(){
    this.addPartnerForm.reset();
  }

  prevnext(){
    this.showprevnext = true;
  }

  searchnow(){
    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/SearchSolutionPartner.php?keyword="+this.search).subscribe((res: any) =>{
    this.solution_partner = res;
  });
  }
}
