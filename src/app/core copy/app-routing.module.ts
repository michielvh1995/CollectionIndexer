import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardPageComponent } from '../add-card/add-card-page/components/add-card-page.component';
import { CardCollectionOverviewComponent } from '../card-collection-overview/card-collection-overview/components/card-collection-overview.component';

const routes: Routes = [
  { path: '', redirectTo: '/cards', pathMatch: 'full' },
  { path: 'cards', component: CardCollectionOverviewComponent },
  { path: 'new-card', component: AddCardPageComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
