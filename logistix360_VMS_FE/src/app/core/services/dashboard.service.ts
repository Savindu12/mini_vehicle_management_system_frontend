import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface DashboardSummaryResponse {
  counts: {
    vehicles_total: number;
    drivers_total: number;
    vehicles_available: number;
    vehicles_in_maintenance: number;
    vehicles_on_route: number;
  };
}

export interface DashboardRecentResponse {
  recent_vehicles: any[];
  recent_drivers: any[];
}


@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  summary() {
    return this.api.get<DashboardSummaryResponse>('/dashboard/summary');
  }

  recent(vehicles = 5, drivers = 5) {
    return this.api.get<DashboardRecentResponse>(
      `/dashboard/recent?vehicles=${vehicles}&drivers=${drivers}`
    );
  }
}
