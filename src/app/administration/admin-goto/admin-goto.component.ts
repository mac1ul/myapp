import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-admin-goto',
  templateUrl: './admin-goto.component.html',
  styleUrls: ['./admin-goto.component.scss']
})
export class AdminGotoComponent implements OnInit {

  goto_data: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetGoToData.php").subscribe((res : any) =>{
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

  searchbymaterials(data: any, status: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetGoToDataSearchresult.php?data="+data+"&status="+status).subscribe((res : any) =>{
        this.showProducts = res;
    });
  }

  searchbydescriptions(data: any, status: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetGoToDataSearchresult.php?data="+data+"&status="+status).subscribe((res: any) =>{
    this.showProducts = res;
    });
  }
  prevnext(){
    this.showprevnext = true;
  }
}
