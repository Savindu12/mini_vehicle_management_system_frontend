import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private api: ApiService) {}

  getProfile() {
    return this.api.get<any>('/profile');
  }

  updateProfile(payload: any) {
    return this.api.put<any>('/profile', payload);
  }

  updateImage(fd: FormData) {
    return this.api.post<any>('/profile/image', fd);
  }

  changePassword(payload: any) {
    return this.api.put<any>('/profile/password', payload);
  }
}
