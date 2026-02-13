import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type JsonOptions = {
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
  headers?: { [header: string]: string | string[] };
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, options: JsonOptions = {}): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`, options);
  }

  post<T>(path: string, body: any, options: JsonOptions = {}): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body, options);
  }

  put<T>(path: string, body: any, options: JsonOptions = {}): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body, options);
  }

  delete<T>(path: string, options: JsonOptions = {}): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`, options);
  }
  postWithEvents<T>(path: string, body: any, options: any = {}): Observable<HttpEvent<T>> {
  return this.http.post<T>(`${this.base}${path}`, body, {
    ...options,
    observe: 'events',
    reportProgress: true,
  });
}
}
