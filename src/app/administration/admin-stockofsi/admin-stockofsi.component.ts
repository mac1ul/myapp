import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-admin-stockofsi',
  templateUrl: './admin-stockofsi.component.html',
  styleUrls: ['./admin-stockofsi.component.scss']
})
export class AdminStockofsiComponent implements OnInit {

  stockofsi: any;
  rowsPerPage: number = 10;
  actualPage: number = 1;
  endPaging: any;
  showProducts: any;
  showprevnext: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetStockofSIdata.php").subscribe((res : any) =>{
        this.stockofsi = res;
        this.pagination();
        this.updateViewAfterPaginationClicked();
    });
    $('.module-search').moduleSearch();
    $('.module-input').moduleInput();

    this.pagination();
  }

    searchbytypecodes(data: any, status: any){
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetStockOfSISearchResult.php?data="+data+"&status="+status).subscribe((res : any) =>{
          this.stockofsi = res;
          this.pagination();
          this.updateViewAfterPaginationClicked();
        });
    }

    searchbypartnumbers(data: any, status: any){
      this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/GetStockOfSISearchResult.php?data="+data+"&status="+status).subscribe((res : any) =>{
        this.stockofsi = res;
        this.pagination();
        this.updateViewAfterPaginationClicked();
      });
    }

  pagination() {
    if (this.stockofsi.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.stockofsi.length / this.rowsPerPage)
    } else {
      this.endPaging = this.stockofsi.length / this.rowsPerPage
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
    this.showProducts = this.stockofsi.slice(start, end);
  }
  prevnext(){
    this.showprevnext = true;
  }

}
