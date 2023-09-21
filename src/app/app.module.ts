import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdministrationModule } from './administration/administration.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountryunitModule } from './countryunit/countryunit.module';
import { SolutionpartnerModule } from './solutionpartner/solutionpartner.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {BreadcrumbModule} from 'angular-crumbs';
import { BreadcrumbModule } from "xng-breadcrumb";
import { BreadcrumbService } from 'xng-breadcrumb';
import { SharedcomponentsModule } from './sharedcomponents/sharedcomponents.module';
import { CookieService } from 'ngx-cookie-service';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import { AuthenticationserviceService } from './services/authenticationservice.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdministrationModule,
    CountryunitModule,
    SolutionpartnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BreadcrumbModule,
    AdministrationModule,
    CountryunitModule,
    SharedcomponentsModule,
    NgDynamicBreadcrumbModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [BreadcrumbService, CookieService, AuthenticationserviceService],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
