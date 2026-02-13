import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

type LoginResponse = {
  token_type: 'Bearer';
  access_token: string;
  expires_in_minutes: number;
  user?: any;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private api: ApiService) {}

  register(payload: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.api.post('/register', payload);
  }

  login(payload: { login: string; password: string; device_name?: string }) {
    return this.api.post<LoginResponse>('/login', payload).pipe(
      tap((res) => localStorage.setItem(this.tokenKey, res.access_token))
    );
  }

  me() {
    return this.api.get('/me');
  }

  logout() {
    return this.api.post('/logout', {});
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
