import { Component, OnInit } from '@angular/core';
declare var $: any;
import { BackendservicesService } from 'src/app/sharedcomponents/backendservices.service';
import { LoginserviceService } from '../../loginservice.service';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-listoffasttrack',
  templateUrl: './listoffasttrack.component.html',
  styleUrls: ['./listoffasttrack.component.scss']
})
export class ListoffasttrackComponent implements OnInit {
  token: string = '';
  emailaddress: string = '';
  spid: any;
  list: any;
  isShow: boolean = false;
  rowClicked: any;
  details: any= [];
  data: any;
  final: any = [];
  display: any;
  fasttrack_body: any;
  showdetailss: boolean = false;
  showmsg: boolean = false;
  message: any;
  Solution_Partner_id: any;
  user_id: any;
  constructor(private getdata: AfterloginserviceService, private http: HttpClient) {
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
      this.user_id = element.userID;
      this.Solution_Partner_id = element.company_registered_id;
    });
    // console.log(this.emailaddress + ' '+ this.spid);
   }

  ngOnInit(): void {
    // this.http.get<any>("https://rb-mobileweb.de.bosch.com/2021/spm/php_v3.0/Listoffasttrack_body.php").subscribe((res: any) =>{
    //   this.data = res;
    //   // this.final.push(res);
    //   this.data.forEach((element: any) => {
    //       this.final.push(element);
    //   });
    // }); 

    $('.module-accordion').moduleAccordion();
    this.http.get<any>(environment.baseurl+"Listoffasttrack.php?&token="+this.token).subscribe((res: any) =>{
      this.list = res;
    });
    $('.module-tab-navigation').moduleTabNavigation();
  }

  showdetails( fid: any, message: any){
    this.showdetailss = true;
    this.message = message;
    this.http.get<any>(environment.baseurl+"salesunit_fasttrack_body.php?fasttrack_id="+fid+"&token="+this.token).subscribe((res: any) =>{
      this.fasttrack_body = res;
      // console.log(this.fasttrack_body);
    });
  }

  goBack(){
    this.showdetailss = false;
  }
  openMsg(){
    this.showmsg = true;
  }
}
