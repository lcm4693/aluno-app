import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(payload: { email: string; senha: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/login', payload);
  }
}
