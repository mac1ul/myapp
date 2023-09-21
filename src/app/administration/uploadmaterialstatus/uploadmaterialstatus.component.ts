import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-uploadmaterialstatus',
  templateUrl: './uploadmaterialstatus.component.html',
  styleUrls: ['./uploadmaterialstatus.component.scss']
})
export class UploadmaterialstatusComponent implements OnInit {
  arrayBuffer:any;
  selectedFile: any = File;
  DisplayPartNumber: boolean = false;
  toggle: boolean = false;
  selectedMasterFile: any = File;
  showprogress: boolean = false;
  showstartlable: boolean = false;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    $('.component-file-selector').moduleFileSelector();
  }
  gotoNext(){
    this.toggle = true;
  }
  onFileChanged(event: any){
    this.selectedFile = event.target.files[0];
    // console.log(this.selectedFile);
  }
  Upload(){
    const Uploaddata = new FormData();
    Uploaddata.append('myFile', this.selectedFile, this.selectedFile.name);
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/ReadExcelFile1.php", Uploaddata).subscribe((res : any) =>{
      if(res.okay === true){
        alert(res.message);
      }else{
        alert(res.message);
      }
      // if(res !== null){
        //   if(res.status){
        //     this.DisplayPartNumber = true;
        //   }
        // }
    });
    // const Uploaddata = new FormData();
    // Uploaddata.append('myFile', this.selectedFile, this.selectedFile.name);

    // this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/ReadExcelFile.php", Uploaddata).subscribe((res : any) =>{
    //     if(res !== null){
    //       if(res.status){
    //         this.DisplayPartNumber = true;
    //       }
    //     }
    // });
  }
  incomingfile(event: any){
    this.selectedMasterFile = event.target.files[0];

  }
  add3dmapmaster(){
    this.showstartlable = true
    const Uploaddata = new FormData();
    Uploaddata.append('myFile', this.selectedMasterFile, this.selectedMasterFile.name);
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Insert3DModeldynamic.php", Uploaddata).subscribe((res : any) =>{
        if(res.ok === true){
          this.showprogress = true;
          this.showstartlable = false;
          alert(res.message)
        }else{
          this.showstartlable = false;
          alert(res.message)
        }
    });
  }
  updateph(){
    this.showstartlable = true;
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/catchproduct.php").subscribe((res : any) =>{
      if(res.okay === true){
        this.showprogress = true;
        this.showstartlable = false;
        alert(res.message);
      }else{
        alert(res.message);
        this.showstartlable = false;
      }
    });
  }
}
