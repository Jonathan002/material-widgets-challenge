import { SharedModule } from './_shared/shared.module';
import { CoreModule } from './_core/core.module';
import { MockModule } from './mock/mock.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './_/core/spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    MockModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
