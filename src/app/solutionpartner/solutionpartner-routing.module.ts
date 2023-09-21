import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, ExtraOptions } from '@angular/router';
import { AddmachineclistComponent } from './addmachineclist/addmachineclist.component';
import { AddprojectlistComponent } from './addprojectlist/addprojectlist.component';
import { FasttrackComponent } from './fasttrack/fasttrack.component';
import { GotoComponent } from './goto/goto.component';
import { ListoffasttrackComponent } from './listoffasttrack/listoffasttrack.component';
import { MaterialComponent } from './material/material.component';
import { PartnerMaterialPlanningComponent } from './partner-material-planning/partner-material-planning.component';
import { PricerequestComponent } from './pricerequest/pricerequest.component';
import { SolutionPartnerHomeComponent } from './solution-partner-home/solution-partner-home.component';
import { StockofSIComponent } from './stockof-si/stockof-si.component';
import { ThreedmapComponent } from './threedmap/threedmap.component';

import { CheckdeliverytimeComponent } from './checkdeliverytime/checkdeliverytime.component';
import { SpContactUsComponent } from './sp-contact-us/sp-contact-us.component';
import { ListofpricerequestComponent } from './listofpricerequest/listofpricerequest.component';
import { SpCheckdeliverytimeComponent } from './sp-checkdeliverytime/sp-checkdeliverytime.component';
import { ChecksproleGuard } from '../services/checksprole.guard';
const routes: Routes = [
  { path: '', 
    component: SolutionPartnerHomeComponent ,
    children :[
    { path : '', redirectTo : 'SPDashboard', pathMatch : 'full' },
      { path : 'Add_project', component : AddprojectlistComponent, data: { breadcrumb: {alias: 'ProjectList'} }, children:[
        { path : 'Add_Machine/:id', component : AddmachineclistComponent, data: { breadcrumb: {alias: 'Machine'} }, children: [
          { path : 'Add_Material/:machineid', component : MaterialComponent, data: { breadcrumb: {alias: 'Materials'} }, children: [
            { path : 'Fast_track', component : FasttrackComponent, data: { breadcrumb: {alias: 'FastTrack'} } },
            { path : 'Price_Request', component : PricerequestComponent, data: { breadcrumb: {alias: 'PriceRequest'} } }
          ]},
        ]},
      ]},
  ]},
  {path: 'StockofSI', component: StockofSIComponent},
  {path: 'Material_Planning', component: PartnerMaterialPlanningComponent},
  {path: '3DMAP', component: ThreedmapComponent},
  {path: 'ListofFastTrack', component: ListoffasttrackComponent},
  {path: 'ListofPriceRequest', component: ListofpricerequestComponent},
  {path: 'GoTo', component: GotoComponent},
  {path: 'Contact_Us', component: SpContactUsComponent},
  {path: 'Check_Materials_Deliverytime', component: SpCheckdeliverytimeComponent}
];
// const routes: Routes = [
//   { path: '', 
//     component: SolutionPartnerHomeComponent ,
//     children :[
//     { path : '', redirectTo : 'SPDashboard', pathMatch : 'full' },
//     {path : 'SPDashboard', component: SolutionPartnerHomeComponent, data: { breadcrumb: {alias: 'Dashboard'} }, children: [
//       { path : 'Add_project', component : AddprojectlistComponent, data: { breadcrumb: {alias: 'ProjectList'} }, children:[
//         { path : 'Add_Machine', component : AddmachineclistComponent, data: { breadcrumb: {alias: 'Machine'} }, children: [
//           { path : 'Add_Material', component : MaterialComponent, data: { breadcrumb: {alias: 'Materials'} }},
//         ]},
//       ]},
//     ]}
//   ]}
// ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolutionpartnerRoutingModule {
 }
