import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private api: ApiService) {}

  list(params: { q?: string; status?: string; vehicle_type?: string; page?: number } = {}) {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.status) sp.set('status', params.status);
    if (params.vehicle_type) sp.set('vehicle_type', params.vehicle_type);
    if (params.page) sp.set('page', String(params.page));
    const query = sp.toString() ? `?${sp.toString()}` : '';
    return this.api.get<any>(`/vehicles${query}`);
  }

  create(fd: FormData) {
    return this.api.post<any>('/vehicles', fd);
  }

  update(id: number, fd: FormData) {
    // easiest way for multipart update
    fd.set('_method', 'PUT');
    return this.api.post<any>(`/vehicles/${id}`, fd);
  }

  delete(id: number) {
    return this.api.delete<any>(`/vehicles/${id}`);
  }
}
