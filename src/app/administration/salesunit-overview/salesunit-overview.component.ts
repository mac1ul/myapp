import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
@Component({
  selector: 'app-salesunit-overview',
  templateUrl: './salesunit-overview.component.html',
  styleUrls: ['./salesunit-overview.component.scss']
})
export class SalesunitOverviewComponent implements OnInit {
  httpHeader: any;
  token: any;

  salesunitdata: any=[];
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  constructor(private http: HttpClient, private LoginserviceService: AfterloginserviceService) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;
    });
  }
  ngOnInit(): void {
    this.http.get<any>(environment.adminBaseUrl+"Salesunit_overview.php?&token="+this.token).subscribe((res: any) =>{
      this.salesunitdata = res;
    });
  }
  prevnext(){
    this.showprevnext = true;
  }
}
