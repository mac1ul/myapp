import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $: any;
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationserviceService } from '../../services/authenticationservice.service';
@Component({
  selector: 'app-su-materialplanning',
  templateUrl: './su-materialplanning.component.html',
  styleUrls: ['./su-materialplanning.component.scss'],
  providers: [DatePipe]
})
export class SuMaterialplanningComponent implements OnInit {
  userdata: any;
  token: any;
  emailid: string = '';
  permission: string = '';
  salesunit_id: any;
  access: boolean = false;
  role: string = '';
  getsolutionpartner: any;
  getprojectbypartner: any;
  getmachine: any;

  tabledata: any;
  showpagination: boolean = false;
  showpartnerdetails: boolean = false;
  showproject: boolean = false;
  showmachine: boolean = false;
  // variable for machine
  location: string = '';
  project_name: string = '';
  partner_company_name: string = '';
  machine_name: string = '';
  machine_phase: string = '';
  industry_sector: string = '';
  application: string = '';
  machine_description: string = '';
  toggleBool: boolean = false;
  company_id: string = '';
  set_table_value_project : string = '';
  set_table_value_machine : string = '';

  rowsPerPage: number = 10;
  actualPage: number = 1;
  showprevnext: boolean = false;
  endPaging: any;
  showProducts: any;
  logoBase64 = "data:image/jpeg;base64,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";
  latest_date1: any;
  showerrmessage: any;
  showhideerrmsg: boolean = false;
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  lastProjectId: any;
  recordcount: boolean = false;
  hideextraelement: boolean = true;
  downloadAllMachines: boolean = false;
  checkNullValue: boolean = false;
  constructor(private cookieservice: CookieService, private authservice: AuthenticationserviceService, private LoginserviceService: AfterloginserviceService, private datePipe: DatePipe, private getdata: BackendservicesService, private Router: Router, private http: HttpClient) {
    this.LoginserviceService.userdata().forEach(element => {
      this.token = element.token;
      this.emailid = element.email;
      this.salesunit_id = element.userID;
      this.permission = element.permission;
      this.role = element.role;
      // console.log(this.emailid)
    });
    this.latest_date1 = this.datePipe.transform(new Date(), 'dd-MMM-YYYY HH:mm:ss');
   }

  ngOnInit(): void {

    this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checktokenduration.php?token="+this.token).subscribe((res : any) =>{
      if(res.ok === true){
        console.log(res.message)
      }else{
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/sessiondestroy.php").subscribe((res: any) =>{
          console.log('Your session is expired!');
        });
        localStorage.clear();
        this.cookieservice.deleteAll();
        sessionStorage.clear();
        alert(res.message)
        setTimeout(()=>{
          window.location.href = "https://p1.authz.bosch.com/auth/realms/dc/protocol/openid-connect/logout?post_logout_redirect_uri=https://mobilehydraulics.boschrexroth.com/spm_testversion3.0/Demo";
        },200)
        // this.authservice.authentication();
      }
    });

    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/material_cu_getallsolutionpartner.php?token="+this.token).subscribe((res: any) =>{
      this.getsolutionpartner = res;
    });
    this.pagination();
  }

  onchangesp(partnerid: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/material_cu_getallSPproject.php?partnerid="+partnerid+"&token="+this.token).subscribe((res: any) =>{
      this.getprojectbypartner = res;
    });
    this.getmachine = null;
  }
  onchangeproject(projectid: any){
    this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/SU_material_getmachines.php?project_id="+projectid+"&token="+this.token).subscribe((res: any) =>{
      this.getmachine = res;
    });
  }
  search(param: any, status: any){
    if(status === "partnerdetails"){
      if(param == null || param == ""){

      }else{
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/admin_material_getsolutionpartnerbycountry.php?partnerdetails="+param+"&status="+status+"&token="+this.token).subscribe((res: any) =>{
      this.tabledata = res;
      if(this.tabledata == null || this.tabledata == ""){
        this.showhideerrmsg = true;
        this.showproject = false;
        this.showpartnerdetails = false;
        this.showmachine = false;
        this.showpagination = false;
      this.showerrmessage = "Partner data is not found.";
      }else{
        this.showpartnerdetails = true;
      this.showproject = false;
      this.showmachine = false;
      this.showhideerrmsg = false;
      this.showpagination = true;
      this.pagination();
      this.updateViewAfterPaginationClicked();
      }
      });
      }
    } else if(status === "project"){
      this.set_table_value_project = param;
      this.lastProjectId = param;
      if(param == null || param == ""){

      }else{
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/SU_material_gettabledata.php?project_id="+param+"&status="+status+"&token="+this.token).subscribe((res: any) =>{
      this.tabledata = res;
      if(this.tabledata == null || this.tabledata == ""){
        this.showhideerrmsg = true;
        this.showproject = false;
        this.showpartnerdetails = false;
        this.showmachine = false;
        this.showpagination = false;
      this.showerrmessage = "Customer data is not found.";
      }else{
        this.showproject = true;
      this.showmachine = false;
      this.showpartnerdetails = false;
      this.showhideerrmsg = false;
      this.showpagination = true;
      this.pagination();
      this.updateViewAfterPaginationClicked();
      }
      });
      }
    } else if(status === "machine" && param !== 'all'){
      this.set_table_value_machine = param;
      if(param == null || param == ""){

      }else{
        this.http.get<any>("https://rb-mobileweb.de.bosch.com/SPM/backend/SU_material_gettabledata.php?machine_id="+param+"&status="+status+"&token="+this.token).subscribe((res: any) =>{
        this.tabledata = res;
        if(this.tabledata == null || this.tabledata == ""){
          this.showhideerrmsg = true;
          this.showproject = false;
          this.showpartnerdetails = false;
          this.showmachine = false;
          this.showpagination = false;
          this.showerrmessage = "Machine data is not found.";
        }else{
          this.showproject = false;
          this.showpartnerdetails = false;
          this.showmachine = true;
          this.showhideerrmsg = false;
          this.showpagination = true;
          this.pagination();
          this.updateViewAfterPaginationClicked();
          this.tabledata.forEach((element: any) => {
            this.location = element.location;
            this.project_name = element.project_name;
            this.machine_name = element.machine_name;
            this.machine_description = element.machine_description;
            this.machine_phase = element.machine_phase;
            this.industry_sector = element.industry_sector;
            this.application = element.application;
            this.partner_company_name = element.partner_company_name
          });
        }
      });
      }
    }else if(param === 'all'){
      this.http.get<any>('https://rb-mobileweb.de.bosch.com/SPM/backend/SU_material_gettabledata.php?project_id=' +this.lastProjectId +'&status=all&token='+this.token).subscribe((res: any) => {
        this.tabledata = res;
        if(this.tabledata == null || this.tabledata == ""){
          this.showhideerrmsg = true;
          this.showproject = false;
          this.showpartnerdetails = false;
          this.showmachine = false;
          this.showpagination = false;
          this.showerrmessage = "Machine data is not found.";
        }else{
          this.showproject = false;
          this.showpartnerdetails = false;
          this.showmachine = true;
          this.showhideerrmsg = false;
          this.showpagination = true;
          this.pagination();
          this.updateViewAfterPaginationClicked();
          this.tabledata.forEach((element: any) => {
            this.location = element.location;
            this.project_name = element.project_name;
            this.machine_name = element.machine_name;
            this.machine_description = element.machine_description;
            this.machine_phase = element.machine_phase;
            this.industry_sector = element.industry_sector;
            this.application = element.application;
            this.partner_company_name = element.partner_company_name
          });
        }
      });
    }
  }
  // Excel Service
  exportElmToExcel() {
    if(this.showpartnerdetails === true){
      //Excel Title, Header, Data
      const title = 'SPM - Material Planning';
      const header = ["ID","Customer Name", "Customer Number", "Machine Name", "Machine Status", "Application", "Part Number", "Typecode", "Product", "Product Detailed", "Product Family", "Material Status", "Material Qty", "2019", "2020", "2021", "Actual 2022", "Plan 2023", "Plan 2024"]

      //Create workbook and worksheet
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Sheet1');

      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'BoschSans-Bold', family: 4, vertAlign: 'superscript', size: 24, underline: 'none', bold: true, color: { argb: '002B49' } }
      worksheet.addRow([]);

      worksheet.addRow([]);
      // let latestdate = worksheet.addRow(['','','','','','','','','',this.latest_date1]);
      // latestdate.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: false }


      //Add Image
      let logo = workbook.addImage({
        base64: this.logoBase64,
        extension: 'png',
      });
      worksheet.addImage(logo, 'J1:J2');
      worksheet.mergeCells('A1:S3');
      //Blank Row
      worksheet.addRow([]);
      let getCompanyName: any = JSON.stringify(this.tabledata[0]["partner_company_name"]);
      let printCompanyName = worksheet.addRow(["Partner Company Name:", getCompanyName, '','','','','','','',this.latest_date1]);
      printCompanyName.font = {
        name: 'BoschSans-Bold',
        family: 4,
        size: 12,
        underline: 'none',
        bold: false,
      };
      // worksheet.mergeCells('A6:C6');
      worksheet.addRow([]);
      //Add Header Row
      let headerRow = worksheet.addRow(header);
      // footerRow.getCell(1).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'FFCCFFE5' }
      // };
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: true }
      })
      // Add Data and Conditional Formatting
      let i = 1;
      this.tabledata.forEach((d: any) => {
        let row = worksheet.addRow([
          i,
          d.project_name,
          d.project_number,
          d.machine_name,
          d.machine_phase,
          d.application,
          d.part_number,
          d.description,
          d.product,
          d.product_detailed,
          d.product_family,
          d.material_phase,
          d.qtypermachine,
          d.previousYear2Qty,
          d.previousYear1Qty,
          d.currentYearQty,
          d.futureYear1Qty,
          d.futureYear2Qty,
          d.futureYear3Qty
        ]);
        i = i + 1;
        row.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: false }
      });
      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 20;
      worksheet.getColumn(7).width = 20;
      worksheet.getColumn(8).width = 20;
      worksheet.getColumn(9).width = 20;
      worksheet.getColumn(10).width = 20;
      worksheet.getColumn(11).width = 20;
      worksheet.getColumn(12).width = 20;
      worksheet.getColumn(13).width = 10;
      worksheet.getColumn(14).width = 10;
      worksheet.getColumn(15).width = 10;
      worksheet.getColumn(16).width = 10;
      worksheet.getColumn(17).width = 10;
      worksheet.getColumn(18).width = 10;
      worksheet.getColumn(19).width = 10;
      worksheet.addRow([]);

      //Footer Row
      // let footerRow = worksheet.addRow(['This is a system generated excel sheet. ©Bosch Rexroth AG 2014-2021, all rights reserved ']);
      // footerRow.getCell(1).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'FFCCFFE5' }
      // };
      // footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      // //Merge Cells
      // worksheet.mergeCells(`A${footerRow.number}:S${footerRow.number}`);
      // footerRow.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: true }
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'MaterialPlanning.xlsx');
      })
    }else if(this.showproject === true){
      //Excel Title, Header, Data
      const title = 'SPM - Material Planning';
      const header = ["ID", "Solution Partner Name","Customer Title", "Customer Number", "Machine List", "Description", "Machine Phase", "Industry Sector", "Application", "Location"]

      //Create workbook and worksheet
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Sheet1');

      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'BoschSans-Bold', family: 4, vertAlign: 'superscript', size: 24, underline: 'none', bold: true, color: { argb: '002B49' } }
      worksheet.addRow([]);

      worksheet.addRow([]);
      let latestdate = worksheet.addRow([this.latest_date1]);
      latestdate.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: true }


      //Add Image
      let logo = workbook.addImage({
        base64: this.logoBase64,
        extension: 'png',
      });
      worksheet.addImage(logo, 'J1:J2');
      worksheet.mergeCells('A1:J3');
      //Blank Row
      worksheet.addRow([]);
      //Add Header Row
      let headerRow = worksheet.addRow(header);

      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: false }
      })

      // Add Data and Conditional Formatting
      let i = 1;
      this.tabledata.forEach((d: any) => {
        let row = worksheet.addRow([
          i,
          d.partner_company_name,
          d.project_name,
          d.project_number,
          d.machine_name,
          d.machine_description,
          d.machine_phase,
          d.industry_sector,
          d.application,
          d.location
        ]);
        i = i + 1;
        // let qty = row.getCell(5);
        // let color = 'FF99FF99';
        // if (+qty.value < 500) {
        //   color = 'FF9999'
        // }
        // qty.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor: { argb: color }
        // }
        row.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: false }
      });

      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(6).width = 40;
      worksheet.getColumn(7).width = 40;
      worksheet.getColumn(8).width = 40;
      worksheet.getColumn(9).width = 40;
      worksheet.getColumn(10).width = 30;
      worksheet.addRow([]);

      //Footer Row
      let footerRow = worksheet.addRow(['This is a system generated excel sheet. ©Bosch Rexroth AG 2014-2021, all rights reserved ']);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' }
      };
      footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      //Merge Cells
      worksheet.mergeCells(`A${footerRow.number}:J${footerRow.number}`);
      footerRow.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: true }
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'MaterialPlanning.xlsx');
      })
    }else if(this.showmachine === true){
      //Excel Title, Header, Data
      const title = 'SPM - Material Planning';
      const header = ["ID", "Machine List", "Part Number", "Typecode", "Product", "Product Details", "Product Family", "Delivery Time", "Material Status", "Qty per Machine", "2019", "2020", "Actual 2021", "Plan 2022", "Plan 2023", "Plan 2024"]

      //Create workbook and worksheet
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('Sheet1');

      //Add Row and formatting
      let titleRow = worksheet.addRow([title]);
      titleRow.font = { name: 'BoschSans-Bold', family: 4, vertAlign: 'superscript', size: 24, underline: 'none', bold: true, color: { argb: '002B49' } }
      worksheet.addRow([]);

      worksheet.addRow([]);
      let latestdate = worksheet.addRow([this.latest_date1]);
      latestdate.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: true }


      //Add Image
      let logo = workbook.addImage({
        base64: this.logoBase64,
        extension: 'png',
      });
      worksheet.addImage(logo, 'H1:H2');
      worksheet.mergeCells('A1:P3');
      //Blank Row
      worksheet.addRow([]);
      //Add Header Row
      let headerRow = worksheet.addRow(header);

      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        cell.font = { name: 'BoschSans-Bold', family: 4, size: 12, underline: 'none', bold: false }
      })

      // Add Data and Conditional Formatting
      let i = 1;
      this.tabledata.forEach((d: any) => {
        let row = worksheet.addRow([
          i,
          d.machine_name,
          d.part_number,
          d.description,
          d.product,
          d.product_detailed,
          d.product_family,
          d.quick_delivery_time,
          d.material_phase,
          d.qtypermachine,
          d.actual2019,
          d.actual2020,
          d.actual2021,
          d.actual2022,
          d.actual2023,
          d.actual2024
        ]);
        i = i + 1;
        // let qty = row.getCell(5);
        // let color = 'FF99FF99';
        // if (+qty.value < 500) {
        //   color = 'FF9999'
        // }
        // qty.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor: { argb: color }
        // }
        row.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: false }
      });

      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(6).width = 40;
      worksheet.getColumn(7).width = 40;
      worksheet.getColumn(8).width = 40;
      worksheet.getColumn(9).width = 40;
      worksheet.getColumn(10).width = 30;
      worksheet.getColumn(11).width = 30;
      worksheet.getColumn(12).width = 30;
      worksheet.getColumn(13).width = 30;
      worksheet.getColumn(14).width = 30;
      worksheet.getColumn(15).width = 30;
      worksheet.addRow([]);

      //Footer Row
      let footerRow = worksheet.addRow(['This is a system generated excel sheet. ©Bosch Rexroth AG 2014-2021, all rights reserved ']);
      footerRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCFFE5' }
      };
      footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      //Merge Cells
      worksheet.mergeCells(`A${footerRow.number}:P${footerRow.number}`);
      footerRow.font = { name: 'BoschSans-Regular', family: 4, size: 11, underline: 'none', bold: true }
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'MaterialPlanning.xlsx');
      })
    }
  }
  pagination() {
    if (this.tabledata.length % this.rowsPerPage != 0) {
      this.endPaging = Math.round(this.tabledata.length / this.rowsPerPage)
    } else {
      this.endPaging = this.tabledata.length / this.rowsPerPage
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
    this.showProducts = this.tabledata.slice(start, end);
  }

  prevnext(){
    this.showprevnext = true;
  }
  checkms(data: any){
    // console.log(data)
    this.http.post<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/checkmaterialstatus.php", data).subscribe((res: any) =>{
      if(res.ok === true){
        alert(res.message);
      }
    });
  }
}
