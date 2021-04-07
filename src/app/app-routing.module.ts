import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { PokerComponent } from './modules/poker/poker.component';

const routes: Routes = [
  {
    path: 'poker/:id',
    component: PokerComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
