import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DriverService {
  constructor(private api: ApiService) {}

  list(params: { q?: string; page?: number } = {}) {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.page) sp.set('page', String(params.page));
    const query = sp.toString() ? `?${sp.toString()}` : '';
    return this.api.get<any>(`/drivers${query}`);
  }

  create(fd: FormData) {
    return this.api.post<any>('/drivers', fd);
  }

  update(id: number, fd: FormData) {
    fd.set('_method', 'PUT');
    return this.api.post<any>(`/drivers/${id}`, fd);
  }

  delete(id: number) {
    return this.api.delete<any>(`/drivers/${id}`);
  }
}
