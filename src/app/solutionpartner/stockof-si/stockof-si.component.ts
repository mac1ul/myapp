import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { environment } from 'src/environments/environment';
declare var $: any;
@Component({
  selector: 'app-stockof-si',
  templateUrl: './stockof-si.component.html',
  styleUrls: ['./stockof-si.component.scss']
})
export class StockofSIComponent implements OnInit {
  httpHeader: any;
  addexcelfiledata: any= FormGroup;
  arrayBuffer:any;
  selectedFile: any = File;
  emailid: string = '';
  partner_registered_id: any;
  partner_stock: any;
  global_stock: any;
  lastupdatedate: any;
  token: any;
  filename: any;
  selectedMasterFile: any = File;
  // showPlatformDetail = true;
  constructor(private LoginserviceService: AfterloginserviceService, private http: HttpClient, private formBuilder: FormBuilder, private getdata: BackendservicesService) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;

    });
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': this.token
    })

    // console.log(this.partner_registered_id);
  }

  ngOnInit(): void {
    this.http.get<any>(environment.baseurl+"GetPartnerStockofSI.php?token="+this.token).subscribe((res : any) =>{
      if(res !== null){
        this.partner_stock = res;
        // console.log(this.partner_stock);
        this.lastupdatedate = JSON.stringify(this.partner_stock[0]['update'])
      }
    });
    this.http.get<any>(environment.baseurl+"GlobalStockofSI.php?token="+this.token).subscribe((res : any) =>{
      if(res !== null){
        this.global_stock = res;
        // console.log(this.global_stock);
      }
    });
    $('.module-tab-navigation').moduleTabNavigation();
    $('.component-file-selector').moduleFileSelector();
  }
  incomingfile(event: any) {
    this.selectedMasterFile = event.target.files[0];
    this.filename = event.target.files[0].name;

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
          this.http.post<any>(environment.baseurl+"InserStockofSI.php", {data: XL_row_object},{headers: this.httpHeader})
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
  downloadFile(){
    const link = document.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', environment.baseurl+'//Stock_of_SI.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  searchbytypecodes(data: any, status: any){
      this.http.get<any>(environment.baseurl+"GetStockOfSISearchResult.php?data="+data+"&status="+status+"&token="+this.token).subscribe((res : any) =>{
        this.partner_stock = res;
        this.partner_stock = this.partner_stock.sort((a: any, b: any) => b.percentage - a.percentage);
      });
  }

  searchbypartnumbers(data: any, status: any){
    let datas = data.replace(/\s/g, "");
    this.http.get<any>(environment.baseurl+"GetStockOfSISearchResult.php?data="+datas+"&status="+status+"&token="+this.token).subscribe((res : any) =>{
      this.partner_stock = res;
      this.global_stock = res;
      this.partner_stock = this.partner_stock.sort((a: any, b: any) => b.percentage - a.percentage);
      this.global_stock = this.partner_stock.sort((a: any, b: any) => b.percentage - a.percentage);
    });
  }
}
