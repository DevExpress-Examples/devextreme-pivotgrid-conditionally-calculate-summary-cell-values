import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DxPivotGridModule, DxCheckBoxModule } from "devextreme-angular"

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
