import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecksuroleGuard } from '../services/checksurole.guard';
import { ThreedmapGlobalComponent } from '../sharedcomponents/threedmap-global/threedmap-global.component';
import { ContactformComponent } from './contactform/contactform.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { PartnerMachineComponent } from './partner-machine/partner-machine.component';
import { PartnerMateriallistComponent } from './partner-materiallist/partner-materiallist.component';
import { PartnerProjectComponent } from './partner-project/partner-project.component';
import { SuAddemployeeComponent } from './su-addemployee/su-addemployee.component';
import { SuAddsolutionpartnerComponent } from './su-addsolutionpartner/su-addsolutionpartner.component';
import { SuCheckdeliverytimeComponent } from './su-checkdeliverytime/su-checkdeliverytime.component';
import { SuContactusComponent } from './su-contactus/su-contactus.component';
import { SuDashboardComponent } from './su-dashboard/su-dashboard.component';
import { SuGotoComponent } from './su-goto/su-goto.component';
import { SuMaterialplanningComponent } from './su-materialplanning/su-materialplanning.component';
import { SuPricerequestComponent } from './su-pricerequest/su-pricerequest.component';
import { SuPrototypeComponent } from './su-prototype/su-prototype.component';
import { SuStockofsiComponent } from './su-stockofsi/su-stockofsi.component';
import { SuSupportComponent } from './su-support/su-support.component';
import { SuThreedmapComponent } from './su-threedmap/su-threedmap.component';

const routes: Routes = [
  { path: '', children :[
    { path : '', redirectTo : 'SalesUnitDashboard', pathMatch : 'full'},
    // { path : 'partner_list', component : PartnerListComponent, data: {breadcrumb: 'partnerlist'}, children: [
    //   { path : 'partner_project_overview/:partnerid', component : PartnerProjectComponent,  data: {breadcrumb: 'projectlist'}, children: [
    //     { path : 'partner_machine_overview/:projectid', component : PartnerMachineComponent, data: {breadcrumb: 'machinelist'}, children: [
    //       { path : 'partner_material_overview/:machineid', component : PartnerMateriallistComponent, data: {breadcrumb: 'materiallist'} }
    //     ]},
    //   ]},
    // ] },

    { path : 'SalesUnitDashboard', component : SuDashboardComponent },
    { path : 'suaddemployee', component : SuAddemployeeComponent },
    { path : 'suaddsolutionpartner', component : SuAddsolutionpartnerComponent},
    { path : 'sumaterialplanning', component : SuMaterialplanningComponent},
    { path : 'sustockofsi', component : SuStockofsiComponent },
    { path : 'sugoto', component : SuGotoComponent},
    { path : 'suprototype', component : SuPrototypeComponent },
    { path : 'supricerequest', component : SuPricerequestComponent },
    { path : 'susupport', component : SuSupportComponent},
    { path : '3D-MAP', component : SuThreedmapComponent},
    { path : 'Delivery-time', component : SuCheckdeliverytimeComponent},
    { path : 'partner_list', component : PartnerListComponent},
    { path : 'partner_project_overview/:partnerid', component : PartnerProjectComponent},
    { path : 'partner_machine_overview/:projectid', component : PartnerMachineComponent},
    { path : 'partner_material_overview/:machineid', component : PartnerMateriallistComponent},
    { path : 'Salesunits_Contactus_Form', component : ContactformComponent},
    { path : 'Salesunits_Contactus', component : SuContactusComponent}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryunitRoutingModule { }
