import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  refreshToken(refreshToken: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${refreshToken}`
    );
    return this.http.post<{ access_token: string }>(
      this.baseUrl + '/refresh',
      {},
      { headers }
    );
  }
}
