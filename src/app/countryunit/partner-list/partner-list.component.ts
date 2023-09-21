import { Component, OnInit } from '@angular/core';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { HttpClient } from '@angular/common/http';
import { Salesunit } from '../../administration/models/salesunit';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {
  salesunit_id: any;
  Allempdata: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  countrecord: boolean = false;
  token: any;
  optionControl: boolean = false;
  constructor(private getdata: AfterloginserviceService, private http: HttpClient) {
    this.getdata.userdata().forEach(element => {
      this.salesunit_id = element.userID;
      this.token = element.token;
    });
   }

  ngOnInit(): void {
    this.http.get<Salesunit>(environment.baseurl + "GetAllSolutionPartner.php?token="+this.token).subscribe((res: Salesunit) =>{
      this.Allempdata = res;
      if(this.Allempdata.length > 0){
        this.Allempdata = res;
        this.countrecord = false;
        this.pagination();
        this.updateViewAfterPaginationClicked();
      }else{
        this.countrecord = true;
      }
    });
    this.pagination()
  }
  pagination() {
    if (this.Allempdata.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.Allempdata.length / this.rowsPerPage)
    } else {
      this.endPaging = this.Allempdata.length / this.rowsPerPage
    }
  }
  onPageChange(value: any) {
    value === this.endPaging - 1 || value === this.endPaging ? this.optionControl = true : this.optionControl = false;
    this.showprevnext = false;
    this.actualPage = value;
    this.updateViewAfterPaginationClicked();
  }
  onChangeRowsPerPage(value: any) {
    // alert(value)
    this.rowsPerPage = value;
    this.pagination();
    this.actualPage = 1;
    this.updateViewAfterPaginationClicked();
  }
  updateViewAfterPaginationClicked() {
    var start = (this.actualPage - 1) * this.rowsPerPage;
    var end = this.actualPage * this.rowsPerPage - 1;
    this.showProducts = this.Allempdata.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }
}
