import { AppModule } from './../app.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavigationComponent } from './admin-navigation/admin-navigation.component';
import { FooterComponent } from './footer/footer.component';
import { EntrySalesunitComponent } from './entry-salesunit/entry-salesunit.component';
import { EntrySolutionpartnerComponent } from './entry-solutionpartner/entry-solutionpartner.component';
import { AdminMaterialplanningComponent } from './admin-materialplanning/admin-materialplanning.component';
import { AdminStockofsiComponent } from './admin-stockofsi/admin-stockofsi.component';
import { AdminGotoComponent } from './admin-goto/admin-goto.component';
import { AdminPrototypeComponent } from './admin-prototype/admin-prototype.component';
import { AdminPricerequestComponent } from './admin-pricerequest/admin-pricerequest.component';
import { AdminSupportComponent } from './admin-support/admin-support.component';
import { SharedcomponentsModule } from '../sharedcomponents/sharedcomponents.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BackendserviceService } from './backendservice.service';
import { UploadmaterialstatusComponent } from './uploadmaterialstatus/uploadmaterialstatus.component';
import { SalesunitOverviewComponent } from './salesunit-overview/salesunit-overview.component';
import { SalesunitPartnersComponent } from './salesunit-partners/salesunit-partners.component';
import { AdminMapComponent } from './admin-map/admin-map.component';
import { CountryunitModule } from '../countryunit/countryunit.module';
import { PartnersProjectdetailsComponent } from './partners-projectdetails/partners-projectdetails.component';
import { ProjectsMachinedetailsComponent } from './projects-machinedetails/projects-machinedetails.component';
import { MachinesMaterialsComponent } from './machines-materials/machines-materials.component';
import { ResponsibleSalesUnitComponent } from './responsible-sales-unit/responsible-sales-unit.component';
import { LogsComponent } from './logs/logs.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminNavigationComponent,
    EntrySalesunitComponent,
    EntrySolutionpartnerComponent,
    AdminMaterialplanningComponent,
    AdminStockofsiComponent,
    AdminGotoComponent,
    AdminPrototypeComponent,
    AdminPricerequestComponent,
    AdminSupportComponent,
    FooterComponent,
    UploadmaterialstatusComponent,
    SalesunitOverviewComponent,
    SalesunitPartnersComponent,
    AdminMapComponent,
    PartnersProjectdetailsComponent,
    ProjectsMachinedetailsComponent,
    MachinesMaterialsComponent,
    ResponsibleSalesUnitComponent,
    LogsComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CountryunitModule
  ],
  providers: [BackendserviceService]
})
export class AdministrationModule { }
