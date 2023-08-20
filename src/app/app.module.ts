import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HtmlCustomPipePipe } from './html-custom-pipe.pipe';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicComponentsModule } from './dynamic-components/dynamic-components.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HttpComponent } from './http/http.component';
import { CommonModule } from '@angular/common';
import { ProtocolComponent } from './protocol/protocol.component';
import { TcpComponent } from './tcp/tcp.component';
import { UdpComponent } from './udp/udp.component';

@NgModule({
  declarations: [
    AppComponent,
    HtmlCustomPipePipe,
    HttpComponent,
    ProtocolComponent,
    TcpComponent,
    UdpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicComponentsModule,
    MatButtonModule,
    MatTooltipModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
