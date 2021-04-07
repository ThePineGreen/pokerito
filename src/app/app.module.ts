import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketModule } from './websocket/websocket.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    WebsocketModule.config({
        url: environment.ws
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
