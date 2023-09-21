import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginserviceService } from '../../loginservice.service';
import * as XLSX from 'xlsx';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-su-stockofsi',
  templateUrl: './su-stockofsi.component.html',
  styleUrls: ['./su-stockofsi.component.scss']
})
export class SuStockofsiComponent implements OnInit {
  httpHeader: any;
  arrayBuffer: any;
  selectedFile: any = File;
  emailid: string = '';
  partner_registered_id: any;
  partner_stock: any;
  global_stock: any;
  filename: any;
  salesunit_id: any;
  user_id: any;
  token: any;
  selectedMasterFile: any = File;
  constructor(private LoginserviceService: AfterloginserviceService, private http: HttpClient) {
    this.LoginserviceService.userdata().forEach(element => {
      this.salesunit_id = element.company_registered_id;
      this.user_id = element.user_id;
      this.token = element.token;

    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })
  }

  ngOnInit(): void {
    this.http.get<any>(environment.suBaseUrl+"GetPartnerStockofSI.php?token="+this.token).subscribe((res: any) => {
      if (res !== null) {
        this.partner_stock = res;
      }
    });
    this.http.get<any>(environment.suBaseUrl+"GlobalStockofSI.php?token="+this.token).subscribe((res: any) => {
      if (res !== null) {
        this.global_stock = res;
      }
    });
    $('.module-tab-navigation').moduleTabNavigation();
    $('.component-file-selector').moduleFileSelector();
    $('.module-search').moduleSearch();
    $('.module-input').moduleInput();
  }
  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', environment.baseurl+'//Stock_of_SI.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  incomingfile(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

    // const target: DataTransfer = <DataTransfer>(event.target);

    // if(target.files.length !== 1){
    //   throw new Error('Please do not select multiple files!');
    // }
    // const reader: FileReader = new FileReader();

    // reader.onload = ((e: any) => {
    //   const bstr: string = e.target.result;

    //   const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
    //   const wsname: string = wb.SheetNames[0];

    //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    //   var XL_row_object = XLSX.utils.sheet_to_json(ws,{raw:true});
    //   this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/InserStockofSI.php", {data: XL_row_object, userdata: this.emailid}).subscribe((res : any) =>{
    //     if(res !== null){
    //       alert(res.message)
    //     }
    //   });
    // });
    // reader.readAsBinaryString(target.files[0]);
  }
  sendFiledata() {
    if (this.filename != null) {
      var reg = /(.*?)\.(xlsx)$/;
      if (!this.filename.match(reg)) {
        alert("Please Select Excel File!");
      } else {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var XL_row_object = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          // this.http.post<any>(environment.suBaseUrl+"Salesunit_StockofSI.php", {data: XL_row_object, userdata: this.partner_registered_id})
          this.http.post<any>(environment.suBaseUrl+"Salesunit_StockofSI.php", {data: XL_row_object},{headers: this.httpHeader})
            .subscribe((response: any) => {
              if (response.ok === true) {
                alert("File successfully added");
                this.ngOnInit();
              }
            });
          // this.router.navigate(['/customers']);

        }
        fileReader.readAsArrayBuffer(this.selectedMasterFile);
      }
    } else {
      alert("Please select an excel file!")
    }
    // const Uploaddata = new FormData();
    // Uploaddata.append('myFile', this.selectedMasterFile, this.selectedMasterFile.name);
    // this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Salesunit_StockofSI.php", Uploaddata).subscribe((res: any) => {
    //   if (res.ok === true) {
    //     alert(res.message)
    //   } else {
    //     alert(res.message)
    //   }
    // });
  }
  searchbytypecodes(data: any, status: any){
    this.http.get<any>(environment.baseurl+"GetStockOfSISearchResult.php?data="+data+"&status="+status+"&token="+this.token).subscribe((res : any) =>{
      this.partner_stock = res;
    });
}

searchbypartnumbers(data: any, status: any){
  this.http.get<any>(environment.baseurl+"GetStockOfSISearchResult.php?data="+data+"&status="+status+"&token="+this.token).subscribe((res : any) =>{
    this.partner_stock = res;
  });
}
}
