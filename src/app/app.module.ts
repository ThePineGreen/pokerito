import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { SocketService } from './service/socket.service';
import { HomeComponent } from './components/home/home.component';
import { ResultComponent } from './components/result/result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LoginComponent } from './components/login/login.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    HomeComponent,
    ResultComponent,
    NavbarComponent,
    SettingsComponent,
    NotificationComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
  ],
  providers: [
    SocketService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
