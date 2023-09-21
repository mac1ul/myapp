import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SetbreadcrumbService } from 'src/app/countryunit/setbreadcrumb.service';
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
@Component({
  selector: 'app-salesunit-partners',
  templateUrl: './salesunit-partners.component.html',
  styleUrls: ['./salesunit-partners.component.scss']
})
export class SalesunitPartnersComponent implements OnInit {
  httpHeader: any;
  token: any;
  su_registered_id: any;
  partnerdetails: any = [];
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  constructor(private breadcrumb: SetbreadcrumbService, private routes: ActivatedRoute, private http: HttpClient,private LoginserviceService: AfterloginserviceService) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;
    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.su_registered_id = this.routes.snapshot.paramMap.get('salesunit_id');
    this.http.get<any>(environment.adminBaseUrl+"partner_overviewbysalesunit.php?salesunit_registered_id="+this.su_registered_id+"&token="+this.token).subscribe((res: any) =>{
      this.partnerdetails = res;
    });
  }
  onclickSales(){
    this.breadcrumb.onclickSalesunit();
  }
  prevnext(){
    this.showprevnext = true;
  }
}
