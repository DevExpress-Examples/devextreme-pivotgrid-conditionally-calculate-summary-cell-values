import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DxPivotGridModule } from "devextreme-angular/ui/pivot-grid"
import { DxCheckBoxModule } from "devextreme-angular/ui/check-box"

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxCheckBoxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
