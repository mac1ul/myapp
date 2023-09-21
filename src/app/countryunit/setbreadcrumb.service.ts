import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SetbreadcrumbService {

  constructor(private router: Router) { }

  onclickPartner(){
    this.router.navigate(['/SalesUnitDashboard/partner_list']);
  }

  onclickProject(projectid: any){
    this.router.navigate(['/SalesUnitDashboard/partner_project_overview',projectid]);
  }

  onclickMachine(machineid: any){
    this.router.navigate(['/SalesUnitDashboard/partner_machine_overview',machineid]);
  }

  // Admin navigation
  onclickMachinedetails(machineid: any){
    this.router.navigate(['/Project_MachineList',machineid]);
  }

  onclickProjectdetails(projectid: any){
    this.router.navigate(['/Project_overview',projectid]);
  }

  onclickPartnerdetails(salesunit_id: any){
    this.router.navigate(['/Partner_overview', salesunit_id]);
  }

  onclickSalesunit(){
    this.router.navigate(['/Salesunit_overview']);
  }
}
