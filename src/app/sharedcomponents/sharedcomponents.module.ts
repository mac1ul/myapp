import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BackendserviceService } from '../administration/backendservice.service';
import { ThreedmapGlobalComponent } from './threedmap-global/threedmap-global.component';
import { CheckdeliverytimeComponent } from './checkdeliverytime/checkdeliverytime.component';
import { RequestControlComponent } from './request-control/request-control.component';

@NgModule({
  declarations: [
    LoginComponent,
    ContactComponent,
    PagenotfoundComponent,
    DisclaimerComponent,
    NavigationComponent,
    FooterComponent,
    ThreedmapGlobalComponent,
    CheckdeliverytimeComponent,
    RequestControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ BackendserviceService],
  exports: [ContactComponent, FooterComponent, ThreedmapGlobalComponent, CheckdeliverytimeComponent]
})
export class SharedcomponentsModule { }
