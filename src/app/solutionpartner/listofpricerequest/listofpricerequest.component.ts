import { Component, OnInit } from '@angular/core';
import { AfterloginserviceService } from 'src/app/services/afterloginservice.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-listofpricerequest',
  templateUrl: './listofpricerequest.component.html',
  styleUrls: ['./listofpricerequest.component.scss']
})
export class ListofpricerequestComponent implements OnInit {
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
  py=new Date().getFullYear();
  currentYear: any = this.py;
  previousYear1 = this.currentYear - 1;
  previousYear2: any = this.previousYear1 - 1;
  futureYear1 = this.currentYear + 1;
  futureYear2: any = this.futureYear1 + 1;
  futureYear3 = this.futureYear2 + 1;
  constructor(private getdata: AfterloginserviceService, private http: HttpClient) { 
    this.getdata.userdata().forEach(element => {
      this.token = element.token;
      this.emailaddress = element.email;
      this.spid = element.Solution_Partner_id;
    });
  }

  ngOnInit(): void {
    this.http.get<any>(environment.baseurl + "Listofpricerrequest.php?token="+this.token).subscribe((res: any) =>{
      // console.log(res);
      this.list = res;
    });
  }

  showdetails(fid: any){
    this.showdetailss = true;
    this.http.get<any>(environment.baseurl + "salesunit_price_body.php?pricerequest_id="+fid+"&token="+this.token).subscribe((res: any) =>{
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
