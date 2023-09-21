import { Component, OnInit } from '@angular/core';
import { BackendserviceService } from '../backendservice.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logdata: any;

  constructor(private backend: BackendserviceService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    //  this.httpClient.get<any>("https://mobilehydraulics.boschrexroth.com/SPM/backend/GetLogData.php?token="+this.token).subscribe((res: any) =>{
    // this.logdata = res;
  // });
}

}
