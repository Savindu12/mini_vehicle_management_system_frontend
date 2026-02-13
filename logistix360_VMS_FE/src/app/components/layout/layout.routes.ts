import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from '../dashboard/pages/dashboard/dashboard.component';
import { VehiclesListComponent } from './components/vehicles-list/vehicles-list.component';
import { DriversListComponent } from './components/drivers-list/drivers-list.component';
import { ProfileComponent } from './components/profile/profile.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vehicles', component: VehiclesListComponent },
      { path: 'drivers', component: DriversListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];
