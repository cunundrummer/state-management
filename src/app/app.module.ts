import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { DebugInfoComponent } from './debug-info/debug-info.component';

import { GlobalService } from './shared-services/global.service';
import { LocationService } from './shared-services/location.service';


@NgModule({
  declarations: [
    AppComponent,
    DebugInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    GlobalService,
    LocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
