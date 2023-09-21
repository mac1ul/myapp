import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGotoComponent } from './admin-goto/admin-goto.component';
import { AdminPrototypeComponent } from './admin-prototype/admin-prototype.component';
import { AdminSupportComponent } from './admin-support/admin-support.component';
import { AdminPricerequestComponent } from './admin-pricerequest/admin-pricerequest.component';
import { AdminStockofsiComponent } from './admin-stockofsi/admin-stockofsi.component';
import { AdminMaterialplanningComponent } from './admin-materialplanning/admin-materialplanning.component';
import { EntrySolutionpartnerComponent } from './entry-solutionpartner/entry-solutionpartner.component';
import { EntrySalesunitComponent } from './entry-salesunit/entry-salesunit.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UploadmaterialstatusComponent } from './uploadmaterialstatus/uploadmaterialstatus.component';
import { SalesunitOverviewComponent } from './salesunit-overview/salesunit-overview.component';
import { SalesunitPartnersComponent } from './salesunit-partners/salesunit-partners.component';
import { AdminMapComponent } from './admin-map/admin-map.component';
import { PartnersProjectdetailsComponent } from './partners-projectdetails/partners-projectdetails.component';
import { ProjectsMachinedetailsComponent } from './projects-machinedetails/projects-machinedetails.component';
import { MachinesMaterialsComponent } from './machines-materials/machines-materials.component';
//new line added for responsible country unit
import { ResponsibleSalesUnitComponent } from './responsible-sales-unit/responsible-sales-unit.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  { path: '', children :[
    { path : '', redirectTo : 'admindashboard', pathMatch : 'full' },
    { path : 'admindashboard', component : AdminDashboardComponent },
    { path : 'entrysalesunit', component : EntrySalesunitComponent },
    { path : 'entrysolutionpartner', component : EntrySolutionpartnerComponent },
    { path : 'adminmaterialplanning', component : AdminMaterialplanningComponent },
    { path : 'adminstockofsi', component : AdminStockofsiComponent },
    { path : 'admingoto', component : AdminGotoComponent  },
    { path : 'adminprototype', component : AdminPrototypeComponent },
    { path : 'adminpricerequest', component : AdminPricerequestComponent  },
    { path : 'adminsupport', component : AdminSupportComponent  },
    { path : 'Upload_files', component : UploadmaterialstatusComponent  },
    { path : 'Salesunit_overview', component : SalesunitOverviewComponent  },
    { path : 'Partner_overview/:salesunit_id', component : SalesunitPartnersComponent  },
    { path : 'Project_overview/:partner_id', component : PartnersProjectdetailsComponent  },
    { path : 'Project_MachineList/:project_id', component : ProjectsMachinedetailsComponent  },
    { path : 'Machine_Materiallist/:machineid', component : MachinesMaterialsComponent  },
    { path : 'Admin_3DMAP_GLOBAL', component : AdminMapComponent  },
    { path : 'Responsible-SalesUnit', component : ResponsibleSalesUnitComponent  }, // new lie for responsible salesunit component
    { path : 'logs', component : LogsComponent  },

  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
