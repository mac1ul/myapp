import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
declare var $: any;
@Component({
  selector: 'app-su-goto',
  templateUrl: './su-goto.component.html',
  styleUrls: ['./su-goto.component.scss']
})
export class SuGotoComponent implements OnInit {
  goto_data: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  token: any;
  optionControl: boolean = false;
  constructor(private http: HttpClient,private getdata: AfterloginserviceService) {
    this.getdata.userdata().forEach((element: any) => {
      this.token = element.token;
    });

  }

  ngOnInit(): void {
    this.http.get<any>(environment.baseurl+"GetGoToData.php?token="+this.token).subscribe((res : any) =>{
        this.goto_data = res;
        this.pagination();
        this.updateViewAfterPaginationClicked();
        // console.log(this.goto_data);
    });
    $('.module-search').moduleSearch();
    $('.module-input').moduleInput();

    this.pagination();
  }
  pagination() {
    if (this.goto_data.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.goto_data.length / this.rowsPerPage)
    } else {
      this.endPaging = this.goto_data.length / this.rowsPerPage
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
    this.showProducts = this.goto_data.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }

  searchbymaterials(data: any, status: any){
    this.http.get<any>(environment.baseurl+"GetGoToDataSearchresult.php?data="+data+"&status="+status+"&token="+this.token).subscribe((res : any) =>{
      this.goto_data = res;
    });
    this.pagination();
    this.updateViewAfterPaginationClicked();
  }

  searchbydescriptions(data: any, status: any){
    this.http.get<any>(environment.baseurl+"GetGoToDataSearchresult.php?data="+data+"&status="+status+"&token="+this.token).subscribe((res: any) =>{
      this.goto_data = res;
    });
    this.pagination();
    this.updateViewAfterPaginationClicked();
  }
}
