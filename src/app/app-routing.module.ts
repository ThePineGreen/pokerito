import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import {RoomComponent} from './components/room/room.component';
import { SessionGuard } from './guards/session.guard';

const routes: Routes = [
  {
    path: 'room/:id',
    component: RoomComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [SessionGuard],
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SessionGuard],
})
export class AppRoutingModule { }
