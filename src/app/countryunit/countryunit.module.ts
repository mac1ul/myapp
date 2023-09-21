import { AppModule } from './../app.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryunitRoutingModule } from './countryunit-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SuDashboardComponent } from './su-dashboard/su-dashboard.component';
import { SuAddemployeeComponent } from './su-addemployee/su-addemployee.component';
import { SuAddsolutionpartnerComponent } from './su-addsolutionpartner/su-addsolutionpartner.component';
import { SuMaterialplanningComponent } from './su-materialplanning/su-materialplanning.component';
import { SuStockofsiComponent } from './su-stockofsi/su-stockofsi.component';
import { SuGotoComponent } from './su-goto/su-goto.component';
import { SuPrototypeComponent } from './su-prototype/su-prototype.component';
import { SuPricerequestComponent } from './su-pricerequest/su-pricerequest.component';
import { SuSupportComponent } from './su-support/su-support.component';
import { SuNavigationComponent } from './su-navigation/su-navigation.component';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PartnerProjectComponent } from './partner-project/partner-project.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { PartnerMachineComponent } from './partner-machine/partner-machine.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PartnerMateriallistComponent } from './partner-materiallist/partner-materiallist.component';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import { ProjectlistPartnerComponent } from './projectlist-partner/projectlist-partner.component';
import { SuThreedmapComponent } from './su-threedmap/su-threedmap.component';
import { ContactformComponent } from './contactform/contactform.component';
import { SuCheckdeliverytimeComponent } from './su-checkdeliverytime/su-checkdeliverytime.component';
import { SuContactusComponent } from './su-contactus/su-contactus.component';
declare var $: any;
@NgModule({
  declarations: [
    SuDashboardComponent,
    SuAddemployeeComponent,
    SuAddsolutionpartnerComponent,
    SuMaterialplanningComponent,
    SuStockofsiComponent,
    SuGotoComponent,
    SuPrototypeComponent,
    SuPricerequestComponent,
    SuSupportComponent,
    SuNavigationComponent,
    PartnerProjectComponent,
    PartnerListComponent,
    PartnerMachineComponent,
    BreadcrumbComponent,
    PartnerMateriallistComponent,
    ProjectlistPartnerComponent,
    SuThreedmapComponent,
    ContactformComponent,
    SuCheckdeliverytimeComponent,
    SuContactusComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedcomponentsModule,
    CountryunitRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgDynamicBreadcrumbModule
  ],
  exports: [PartnerProjectComponent, PartnerMachineComponent]
})
export class CountryunitModule { }
