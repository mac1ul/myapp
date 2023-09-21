import { NgModule } from '@angular/core';
import { CommonModule, PathLocationStrategy } from '@angular/common';

import { SolutionpartnerRoutingModule } from './solutionpartner-routing.module';
import { SolutionPartnerHomeComponent } from './solution-partner-home/solution-partner-home.component';
import { HttpClientModule } from '@angular/common/http';
import { AdministrationModule } from '../administration/administration.module';
import { SlidenavComponent } from './slidenav/slidenav.component';
import { AddprojectlistComponent } from './addprojectlist/addprojectlist.component';
import { AddmachineclistComponent } from './addmachineclist/addmachineclist.component';
import { MaterialComponent } from './material/material.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { BreadcrumbModule } from "xng-breadcrumb";
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbService } from 'xng-breadcrumb';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import { SpheaderComponent } from './spheader/spheader.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { FasttrackComponent } from './fasttrack/fasttrack.component';
import { PricerequestComponent } from './pricerequest/pricerequest.component';
import { StockofSIComponent } from './stockof-si/stockof-si.component';
import { PartnerMaterialPlanningComponent } from './partner-material-planning/partner-material-planning.component';
import { BackendserviceService } from '../administration/backendservice.service';
import { ThreedmapComponent } from './threedmap/threedmap.component';
import { ListoffasttrackComponent } from './listoffasttrack/listoffasttrack.component';
import { ManagepagesService } from './managepages.service';
import { GotoComponent } from './goto/goto.component';
import { CheckdeliverytimeComponent } from './checkdeliverytime/checkdeliverytime.component';
import { SpContactUsComponent } from './sp-contact-us/sp-contact-us.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ListofpricerequestComponent } from './listofpricerequest/listofpricerequest.component';
import { SpCheckdeliverytimeComponent } from './sp-checkdeliverytime/sp-checkdeliverytime.component';
// import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    SolutionPartnerHomeComponent,
    SlidenavComponent,
    AddprojectlistComponent,
    AddmachineclistComponent,
    MaterialComponent,
    BreadcrumbComponent,
    SpheaderComponent,
    FasttrackComponent,
    PricerequestComponent,
    StockofSIComponent,
    PartnerMaterialPlanningComponent,
    ThreedmapComponent,
    ListoffasttrackComponent,
    GotoComponent,
    CheckdeliverytimeComponent,
    SpContactUsComponent,
    ListofpricerequestComponent,
    SpCheckdeliverytimeComponent
  ],
  imports: [
    CommonModule,
    SolutionpartnerRoutingModule,
    HttpClientModule,
    AdministrationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    BreadcrumbModule,
    SharedcomponentsModule,
    TooltipModule 
  ],exports: [
    StockofSIComponent
  ],
  providers: [BreadcrumbService, BackendserviceService, ManagepagesService]
})
export class SolutionpartnerModule { }
