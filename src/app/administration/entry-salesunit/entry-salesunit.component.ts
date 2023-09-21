import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendserviceService } from '../backendservice.service';
import { HttpClient } from '@angular/common/http';
import { Salesunit } from '../models/salesunit';
import { Apiresponse } from '../models/apiresponse';
declare var $: any;

@Component({
  selector: 'app-entry-salesunit',
  templateUrl: './entry-salesunit.component.html',
  styleUrls: ['./entry-salesunit.component.scss']
})
export class EntrySalesunitComponent implements OnInit {
  addSalesunitForm: any = FormGroup;
  salesunitdata: any;
  search: any;
  generateuniqueid: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private backend: BackendserviceService, private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/GetSalesUnit.php").subscribe((res: any) =>{
      this.salesunitdata = res;
    });

    $('.module-search').moduleSearch();
    $('.module-pagination').modulePagination();

    this.addSalesunitForm = this.formBuilder.group({
      salesunitname: ['', Validators.required],
      salesunitid: ['', Validators.required],
      country: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  generateid(salesunitname: any){
    const cut: any = salesunitname.substring(2,6);
    const unique: any = '_' + Math.random().toString(36).substr(2, 12);
    this.generateuniqueid = cut + unique;
  }
  OnSubmitSalesUnit(){
    this.httpClient.post<Salesunit>("https://rb-mobileweb.de.bosch.com/SPM/backend/InsertSalesUnit.php", {data: this.addSalesunitForm.value}).subscribe((res: Salesunit) =>{
        if(res.ok === true){
          alert(res.message);
        }else{
          alert(res.message);
        }
    });
  }
  searchnow(){
    this.httpClient.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/SearchSalesUnit.php?keyword="+this.search).subscribe((res: any) =>{
      this.salesunitdata = res;
    });
  }

  OnClearSalesUnitData(){
    this.addSalesunitForm.reset();
  }

  prevnext(){
    this.showprevnext = true;
  }
}
